import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdmittedFlowService } from '../../admitted-flow.service';
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { RegisteredCourse } from '../../../../data/application/courseregistration.dto';

@Component({
  selector: 'app-admitted-courses',
  standalone: true,
  imports: [CommonModule, TraceabilityModule, ButtonComponent],
  templateUrl: './admitted-courses.component.html',
  styleUrl: './admitted-courses.component.scss'
})
export class AdmittedCoursesComponent implements OnInit {
  private readonly router = inject(Router);

  readonly flow = inject(AdmittedFlowService);

  readonly selectedCourses = this.flow.selectedCourses;
  readonly selectedUnits = this.flow.selectedUnits;
  readonly selectedCount = this.flow.selectedCount;
  readonly firstSemesterSelected = this.flow.firstSemesterSelected;
  readonly secondSemesterSelected = this.flow.secondSemesterSelected;
  readonly registrationSubmitted = this.flow.registrationSubmitted;
  readonly availableCourses = this.flow.availableCourses;
  readonly selectedCourseIds = this.flow.selectedCourseIds;
  readonly registeredCourses = this.flow.registeredCourses;

  readonly hasRegisteredCourses = computed(() => this.readRegisteredCourses().length > 0);

  readonly firstSemesterRegistered = computed(() => {
    return this.readRegisteredCourses().filter((course) => this.isFirstSemesterCourse(course));
  });

  readonly secondSemesterRegistered = computed(() => {
    return this.readRegisteredCourses().filter((course) => this.isSecondSemesterCourse(course));
  });

  readonly totalRegisteredUnits = computed(() => 
    this.readRegisteredCourses().reduce((sum, course) => sum + course.units, 0)
  );

  readonly totalRegisteredCount = computed(() => this.readRegisteredCourses().length);

  readonly areRegisteredCoursesApproved = computed(() => {
    const registeredCourses = this.readRegisteredCourses();
    return registeredCourses.length > 0 && registeredCourses.every((course) => course.is_approved);
  });

  readonly canSubmit = computed(() => this.selectedCount() > 0 && !this.registrationSubmitted() && !this.hasRegisteredCourses());

  readonly currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  ngOnInit(): void {
    void this.flow.loadSnapshot();
  }

  toggleCourse(courseId: number, checked: boolean): void {
    if (this.registrationSubmitted() || this.hasRegisteredCourses()) {
      return;
    }
    this.flow.toggleCourseSelection(courseId, checked);
  }

  isChecked(courseId: number): boolean {
    return this.selectedCourseIds().includes(courseId);
  }

  async submitRegistration(): Promise<void> {
    if (!this.canSubmit()) {
      return;
    }
    await this.flow.submitCourseRegistration();
    // Refresh registered courses
    await this.flow.loadRegisteredCourses();
  }

  goToPayment(): void {
    void this.router.navigateByUrl('/admitted/payment');
  }

  downloadCourseSlip(): void {
    const lines = [
      'Course Registration Slip',
      `Student Name: ${this.flow.applicantName()}`,
      `Matric Number: ${this.flow.applicationNo()}`,
      `Programme: ${this.flow.programName()}`,
      `Academic Session: ${this.flow.academicSession()}`,
      `Date: ${this.currentDate}`,
      '',
      'Registered Courses:'
    ];
    const coursesToUse = this.hasRegisteredCourses() ? this.readRegisteredCourses() : this.selectedCourses();
    coursesToUse.forEach((course) => {
      let code: string;
      let title: string;
      if ('course' in course && course.course && 'course' in (course.course as any)) {
        // RegisteredCourse
        code = (course.course as any).course.code;
        title = (course.course as any).course.title;
      } else if ('course' in course && course.course) {
        // AvailableCourse
        code = (course.course as any).code;
        title = (course.course as any).title;
      } else {
        // Fallback
        code = (course as any).code || 'N/A';
        title = (course as any).title || 'N/A';
      }
      lines.push(`${code} - ${title} (${course.units} Units)`);
    });
    lines.push('');
    const totalCount = this.hasRegisteredCourses() ? this.totalRegisteredCount() : this.selectedCount();
    const totalUnits = this.hasRegisteredCourses() ? this.totalRegisteredUnits() : this.selectedUnits();
    lines.push(`Total Courses: ${totalCount}`);
    lines.push(`Total Units: ${totalUnits}`);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `course-slip-${this.flow.applicationNo()}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private readRegisteredCourses(): RegisteredCourse[] {
    return this.registeredCourses?.() ?? [];
  }

  private isFirstSemesterCourse(course: RegisteredCourse): boolean {
    const semesterKey = this.readSemesterKey(course);
    return semesterKey.includes('first') || semesterKey.includes('1st');
  }

  private isSecondSemesterCourse(course: RegisteredCourse): boolean {
    const semesterKey = this.readSemesterKey(course);
    return semesterKey.includes('second') || semesterKey.includes('2nd');
  }

  private readSemesterKey(course: RegisteredCourse): string {
    return (
      course.course?.course?.school_semester
      ?? course.semester
      ?? ''
    ).toLowerCase();
  }
}
