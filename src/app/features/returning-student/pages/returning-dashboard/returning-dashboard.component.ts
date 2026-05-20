import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
export class ReturningDashboardComponent {
  private readonly router = inject(Router);

  readonly flow = inject(ReturningFlowService);

  goToCourses(): void {
    void this.router.navigateByUrl('/returning/courses');
  }

  goToResults(): void {
    void this.router.navigateByUrl('/returning/results');
  }

  goToPayments(): void {
    void this.router.navigateByUrl('/returning/payment');
  }

  goToProfile(): void {
    void this.router.navigateByUrl('/returning/profile');
  }
}

