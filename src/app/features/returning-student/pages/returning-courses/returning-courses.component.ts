import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ReturningCourse, ReturningFlowService, ResitCourse } from '../../returning-flow.service';

@Component({
  selector: 'app-returning-courses',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './returning-courses.component.html',
  styleUrl: './returning-courses.component.scss'
})
export class ReturningCoursesComponent implements OnInit {
  private readonly router = inject(Router);

  readonly flow = inject(ReturningFlowService);

  readonly viewMode = signal<'registration' | 'slip' | 'resit-list' | 'resit-detail'>('registration');

  readonly selectedResit = signal<ResitCourse | null>(null);

  readonly canDownloadCourseSlip = computed(() =>
    this.flow.areRegisteredCoursesApproved()
  );

  readonly canSubmit = computed(() =>
    this.flow.courseReviewState() === 'open' && this.flow.totalCoursesSelectedFromApi() > 0
  );

  readonly firstSemesterSlipCourses = computed(() => this.flow.selectedCoursesFromApi().filter((_, i) => i % 2 === 0));

  readonly secondSemesterSlipCourses = computed(() => this.flow.selectedCoursesFromApi().filter((_, i) => i % 2 === 1));

  ngOnInit(): void {
    this.flow.loadAvailableCourses();
    this.flow.loadRegisteredCourses();
  }

  goToPayment(): void {
    void this.router.navigateByUrl('/returning/payment?flow=school-fee');
  }

  toggle(courseId: number, checked: boolean): void {
    this.flow.toggleCourseSelectionFromApi(courseId, checked);
  }

  async submit(): Promise<void> {
    if (!this.canSubmit()) {
      return;
    }
    await this.flow.submitCourseRegistrationFromApi();
    this.viewMode.set('slip');
  }

  openResitList(): void {
    this.viewMode.set('resit-list');
  }

  openResitDetail(item: ResitCourse): void {
    this.selectedResit.set(item);
    this.viewMode.set('resit-detail');
  }

  openSlip(): void {
    this.viewMode.set('slip');
  }

  backToRegistration(): void {
    this.viewMode.set('registration');
  }

  backToResitList(): void {
    this.viewMode.set('resit-list');
  }

  readonly currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  downloadCourseSlip(): void {
    const lines = [
      'Course Registration Slip',
      `Student: ${this.flow.studentName()}`,
      `Matric Number: ${this.flow.matricNo()}`,
      `Session: ${this.flow.session()}`,
      `Level: ${this.flow.level()}`,
      ''
    ];
    const courses = this.flow.hasRegisteredCourses() ? this.flow.registeredCourses() : this.flow.selectedCoursesFromApi();
    courses.forEach((course) => {
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
    const totalCount = this.flow.hasRegisteredCourses() ? this.flow.totalRegisteredCount() : this.flow.totalCoursesSelectedFromApi();
    const totalUnits = this.flow.hasRegisteredCourses() ? this.flow.totalRegisteredUnits() : this.flow.totalUnitsSelectedFromApi();
    lines.push(`Total Courses: ${totalCount}`);
    lines.push(`Total Units: ${totalUnits}`);

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `course-slip-${this.flow.matricNo().replace(/[^\w-]/g, '-')}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  downloadResitSchedule(course: ResitCourse): void {
    const lines = [
      'Course Resit Schedule',
      `Course: ${course.code} - ${course.title}`,
      `Exam Date: ${course.examDate}`,
      `Time: ${course.examTime}`,
      `Duration: ${course.duration}`,
      `Venue: ${course.venue}`
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `resit-schedule-${course.code}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  payResitFee(course: ResitCourse): void {
    this.flow.addDummyPayment(course.fee);
  }
}
