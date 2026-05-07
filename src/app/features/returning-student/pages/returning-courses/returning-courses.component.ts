import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
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
export class ReturningCoursesComponent {
  private readonly router = inject(Router);
  readonly flow = inject(ReturningFlowService);
  readonly viewMode = signal<'registration' | 'slip' | 'resit-list' | 'resit-detail'>('registration');
  readonly selectedResit = signal<ResitCourse | null>(null);

  readonly canSubmit = computed(() =>
    this.flow.courseReviewState() === 'open' && this.flow.totalCoursesSelected() > 0
  );
  readonly firstSemesterSlipCourses = computed(() => this.flow.selectedCourses().filter((_, i) => i % 2 === 0));
  readonly secondSemesterSlipCourses = computed(() => this.flow.selectedCourses().filter((_, i) => i % 2 === 1));

  goToPayment(): void {
    void this.router.navigateByUrl('/returning/payment');
  }

  toggle(course: ReturningCourse, checked: boolean): void {
    this.flow.toggleCourseSelection(course, checked);
  }

  submit(): void {
    if (!this.canSubmit()) {
      return;
    }
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

  downloadCourseSlip(): void {
    const lines = [
      'Course Registration Slip',
      `Student: ${this.flow.studentName()}`,
      `Matric Number: ${this.flow.matricNo()}`,
      `Session: ${this.flow.session()}`,
      `Level: ${this.flow.level()}`,
      ''
    ];
    this.flow.selectedCourses().forEach((course) => {
      lines.push(`${course.code} - ${course.title} (${course.units} Units)`);
    });
    lines.push('');
    lines.push(`Total Courses: ${this.flow.totalCoursesSelected()}`);
    lines.push(`Total Units: ${this.flow.totalUnitsSelected()}`);

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
