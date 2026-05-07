import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ReturningCourse, ReturningFlowService } from '../../returning-flow.service';

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

  readonly canSubmit = computed(() =>
    this.flow.courseReviewState() === 'open' && this.flow.totalCoursesSelected() > 0
  );

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
    this.flow.submitCourseRegistration();
  }

  // Demo controls to visualize all screenshot states without backend dependency.
  switchState(state: 'waiting' | 'rejected' | 'open'): void {
    this.flow.setCourseReviewState(state);
  }
}

