import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AdmittedFlowService } from '../../admitted-flow.service';
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { AuthSessionStore } from '../../../../store/auth-session.store';
import { PaymentWorkflowService } from '../../../../services/payment-workflow.service';

@Component({
  selector: 'app-admitted-acceptance-payment',
  standalone: true,
  imports: [CommonModule, TraceabilityModule],
  providers: [MessageService],
  templateUrl: './admitted-acceptance-payment.component.html',
  styleUrl: './admitted-acceptance-payment.component.scss'
})
export class AdmittedAcceptancePaymentComponent implements OnInit {
  private readonly router = inject(Router);

  private readonly messageService = inject(MessageService);

  private readonly authSessionStore = inject(AuthSessionStore);

  private readonly paymentWorkflow = inject(PaymentWorkflowService);

  readonly flow = inject(AdmittedFlowService);

  readonly isProcessing = signal(false);

  readonly isVerifying = signal(false);

  ngOnInit(): void {
    void this.flow.loadSnapshot();
  }

  async proceedToPayment(): Promise<void> {
    const applicationNo = this.authSessionStore.applicationNo() || this.flow.applicationNo();
    if (!applicationNo || applicationNo === '—') {
      this.messageService.add({
        severity: 'error',
        summary: 'Acceptance Fee',
        detail: 'Application number not found.'
      });
      return;
    }

    try {
      await this.paymentWorkflow.startAcceptanceFeePayment(applicationNo, {
        onProcessingChange: (processing) => this.isProcessing.set(processing),
        onVerifyingChange: (verifying) => this.isVerifying.set(verifying),
        onSuccess: (title, message) =>
          this.messageService.add({ severity: 'success', summary: title, detail: message }),
        onError: (title, message) =>
          this.messageService.add({ severity: 'error', summary: title, detail: message }),
        onWarning: (title, message) =>
          this.messageService.add({ severity: 'warn', summary: title, detail: message }),
        onVerified: () => {
          void this.flow.loadSnapshot();
        },
        postVerifyNavigateTo: '/admitted/dashboard'
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Acceptance Fee',
        detail: 'Unable to start acceptance fee payment right now.'
      });
    }
  }

  goBackToDashboard(): void {
    void this.router.navigateByUrl('/admitted/dashboard');
  }
}
