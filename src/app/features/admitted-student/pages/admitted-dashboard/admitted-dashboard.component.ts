import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdmittedFlowService } from '../../admitted-flow.service';
import { TraceabilityModule } from '../../../../shared/traceability.module';

@Component({
  selector: 'app-admitted-dashboard',
  standalone: true,
  imports: [CommonModule, TraceabilityModule],
  templateUrl: './admitted-dashboard.component.html',
  styleUrl: './admitted-dashboard.component.scss'
})
export class AdmittedDashboardComponent implements OnInit {
  private readonly router = inject(Router);
  readonly flow = inject(AdmittedFlowService);

  readonly amountPaid = computed(() => {
    const total = this.flow.totalPay();
    return this.formatNaira(total);
  });

  ngOnInit(): void {
    void this.flow.loadSnapshot();
  }

  goToAcceptancePayment(): void {
    void this.router.navigateByUrl('/admitted/payment');
  }

  goToProfileVerification(): void {
    void this.router.navigateByUrl('/admitted/profile');
  }

  downloadReceipt(): void {
    const receiptUrl = this.flow.receiptUrl();
    if (receiptUrl) {
      window.open(receiptUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const lines = [
      'Acceptance Payment Receipt',
      `Applicant: ${this.flow.applicantName()}`,
      `Application Number: ${this.flow.applicationNo()}`,
      `Reference: ${this.flow.transactionReference()}`,
      `Amount: ${this.amountPaid()}`,
      `Date: ${this.flow.paymentDateTime()}`
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `acceptance-receipt-${this.flow.applicationNo()}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private formatNaira(value: number): string {
    return `₦${value.toLocaleString('en-NG')}`;
  }
}
