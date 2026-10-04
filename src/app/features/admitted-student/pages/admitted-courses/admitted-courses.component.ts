import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdmittedFlowService } from '../../admitted-flow.service';
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { RegisteredCourse } from '../../../../data/application/courseregistration.dto';
import {
  downloadCourseSlipFile,
  isFirstSemesterRegisteredCourse,
  isSecondSemesterRegisteredCourse,
} from '../../../../utility/registered-courses';

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

  readonly firstSemesterRegistered = computed(() =>
    this.readRegisteredCourses().filter((course) => isFirstSemesterRegisteredCourse(course))
  );

  readonly secondSemesterRegistered = computed(() =>
    this.readRegisteredCourses().filter((course) => isSecondSemesterRegisteredCourse(course))
  );

  readonly slipRegisteredCourses = computed(() => [
    ...this.firstSemesterRegistered(),
    ...this.secondSemesterRegistered(),
  ]);

  readonly totalRegisteredUnits = computed(() => 
    this.readRegisteredCourses().reduce((sum, course) => sum + course.units, 0)
  );

  readonly totalRegisteredCount = computed(() => this.readRegisteredCourses().length);

  readonly areRegisteredCoursesApproved = computed(() => {
    const registeredCourses = this.readRegisteredCourses();
    return registeredCourses.length > 0 && registeredCourses.every((course) => course.is_approved);
  });

  readonly canDownloadCourseSlip = computed(() =>
    this.slipRegisteredCourses().length > 0 && this.areRegisteredCoursesApproved()
  );

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
    if (!this.canDownloadCourseSlip()) {
      return;
    }
    downloadCourseSlipFile(
      [
        'Course Registration Slip',
        `Student Name: ${this.flow.applicantName()}`,
        `Matric Number: ${this.flow.applicationNo()}`,
        `Programme: ${this.flow.programName()}`,
        `Academic Session: ${this.flow.academicSession()}`,
        `Date: ${this.currentDate}`,
        '',
        'Registered Courses:',
      ],
      this.slipRegisteredCourses(),
      `course-slip-${this.flow.applicationNo()}.txt`
    );
  }

  private readRegisteredCourses(): RegisteredCourse[] {
    return this.registeredCourses?.() ?? [];
  }

}
