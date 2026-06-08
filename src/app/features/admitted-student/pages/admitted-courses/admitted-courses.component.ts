import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdmittedFlowService } from '../../admitted-flow.service';
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-admitted-courses',
  standalone: true,
  imports: [CommonModule, TraceabilityModule, ButtonComponent],
  templateUrl: './admitted-courses.component.html',
  styleUrl: './admitted-courses.component.scss'
})
export class AdmittedCoursesComponent {
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

  readonly canSubmit = computed(() => this.selectedCount() > 0 && !this.registrationSubmitted());

  toggleCourse(courseId: number, checked: boolean): void {
    if (this.registrationSubmitted()) {
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
  }

  goToPayment(): void {
    void this.router.navigateByUrl('/admitted/payment');
  }

  downloadCourseSlip(): void {
    const lines = [
      'Course Registration Slip',
      `Student Name: ${this.flow.applicantName()}`,
      `Matric Number: ${this.flow.applicationNo()}`,
      `program: ${this.flow.programName()}`,
      `Academic Session: ${this.flow.academicSession()}`,
      '',
      'Selected Courses:'
    ];
    this.selectedCourses().forEach((course) => {
      lines.push(`${course.course.code} - ${course.course.title} (${course.units} Units)`);
    });
    lines.push('');
    lines.push(`Total Courses: ${this.selectedCount()}`);
    lines.push(`Total Units: ${this.selectedUnits()}`);
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `course-slip-${this.flow.applicationNo()}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
