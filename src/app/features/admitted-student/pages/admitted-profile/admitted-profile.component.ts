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

  async onFileUpload(event: Event, documentType: 'recommendation_letter_1' | 'recommendation_letter_2' | 'testimonial'): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    await this.flow.uploadDocument(file, documentType);
  }

  async submitForVerification(): Promise<void> {
    await this.flow.submitProfileDocuments();
  }
}
