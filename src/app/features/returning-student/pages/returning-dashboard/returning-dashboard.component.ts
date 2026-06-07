import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ReturningFlowService } from '../../returning-flow.service';

@Component({
  selector: 'app-returning-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './returning-dashboard.component.html',
  styleUrl: './returning-dashboard.component.scss'
})
export class ReturningDashboardComponent implements OnInit {
  private readonly router = inject(Router);

  readonly flow = inject(ReturningFlowService);

  readonly canAccessCourses = computed(() => this.flow.canAccessCoursesModule());

  readonly canAccessProfile = computed(() => this.flow.canAccessProfileModule());

  ngOnInit(): void {
    this.flow.loadStudentFeePlan().catch(() => {});
  }

  goToCourses(): void {
    if (!this.canAccessCourses()) {
      return;
    }
    void this.router.navigateByUrl('/returning/courses');
  }

  goToResults(): void {
    void this.router.navigateByUrl('/returning/results');
  }

  goToPayments(): void {
    void this.router.navigateByUrl('/returning/payment');
  }

  goToProfile(): void {
    if (!this.canAccessProfile()) {
      return;
    }
    void this.router.navigateByUrl('/returning/profile');
  }
}
