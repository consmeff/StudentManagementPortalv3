import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdmittedFlowService } from '../../admitted-flow.service';
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { StatusIndicatorComponent } from '../../../../shared/components/status-indicator/status-indicator.component';

@Component({
  selector: 'app-admitted-profile',
  standalone: true,
  imports: [CommonModule, TraceabilityModule, ButtonComponent, StatusIndicatorComponent],
  templateUrl: './admitted-profile.component.html',
  styleUrl: './admitted-profile.component.scss'
})
export class AdmittedProfileComponent implements OnInit {
  private readonly router = inject(Router);

  readonly flow = inject(AdmittedFlowService);

  ngOnInit(): void {
    void this.flow.loadSnapshot();
  }

  goToPayment(): void {
    void this.router.navigateByUrl('/admitted/payment');
  }

  continueToNextStep(): void {
    void this.router.navigateByUrl('/admitted/dashboard');
  }
}
