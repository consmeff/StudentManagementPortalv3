import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { ReturningFlowService } from '../../returning-flow.service';

@Component({
  selector: 'app-returning-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, TraceabilityModule],
  providers: [MessageService],
  templateUrl: './returning-payment.component.html',
  styleUrl: './returning-payment.component.scss'
})
export class ReturningPaymentComponent {
  private readonly router = inject(Router);

  private readonly messageService = inject(MessageService);

  readonly flow = inject(ReturningFlowService);

  readonly isProcessing = signal(false);

  readonly amountToPay = signal(`${this.flow.suggestedSchoolFeeAmount()}`);

  readonly paymentHistory = computed(() => this.flow.schoolFeeInstallments());

  readonly totalPaid = computed(() => this.formatNaira(this.flow.schoolFeesPaid()));

  readonly remainingAmount = computed(() => this.formatNaira(this.flow.schoolFeesRemaining()));

  readonly amountFieldLabel = computed(() =>
    this.paymentHistory().length === 0 ? 'Make your 1st payment' : 'Continue with next installment'
  );

  readonly suggestedAmount = computed(() => this.formatNaira(this.flow.suggestedSchoolFeeAmount()));

  readonly schoolFeeCardTitle = computed(() => {
    if (!this.flow.canAddSchoolFeeInstallment()) {
      return 'Payment Completed';
    }
    if (this.flow.schoolFeesRemaining() <= 50000 && this.paymentHistory().length >= 2) {
      return 'Final Balance';
    }
    if (this.paymentHistory().length > 0) {
      return 'Outstanding Balance';
    }
    return 'Total school fees';
  });

  readonly schoolFeeMainValue = computed(() => {
    if (!this.flow.canAddSchoolFeeInstallment()) {
      return 'Fully Paid';
    }
    return this.formatNaira(this.flow.schoolFeesRemaining() || this.flow.totalSchoolFees);
  });

  async proceedToPayment(): Promise<void> {
    const value = this.parseAmount(this.amountToPay());
    const fallback = this.flow.suggestedSchoolFeeAmount();
    const amount = value > 0 ? value : fallback;

    this.isProcessing.set(true);
    await this.pause(300);
    const result = this.flow.addSchoolFeeInstallment(amount);
    this.isProcessing.set(false);

    if (!result.ok) {
      this.messageService.add({ severity: 'warn', summary: 'Payment', detail: result.message });
      return;
    }

    this.amountToPay.set(`${this.flow.suggestedSchoolFeeAmount()}`);
    this.messageService.add({ severity: 'success', summary: 'Payment', detail: result.message });
  }

  proceedToCourseRegistration(): void {
    this.router.navigateByUrl('/returning/courses').catch(() => {});
  }

  downloadReceipt(referenceNo?: string): void {
    const selected = referenceNo
      ? this.paymentHistory().find((item) => item.referenceNo === referenceNo) || null
      : null;
    const entries = selected ? [selected] : this.paymentHistory();
    const title = selected ? 'School Fees Receipt' : 'Full School Fees Receipt';

    const lines = [
      title,
      `Student: ${this.flow.studentName()}`,
      `Matric No: ${this.flow.matricNo()}`,
      ...entries.flatMap((entry) => [
        `${entry.installmentLabel}`,
        `Ref No: ${entry.referenceNo}`,
        `Amount: ${this.formatNaira(entry.amount)}`,
        `Date: ${this.formatDate(entry.paidAt)}`
      ]),
      `Total Paid: ${this.totalPaid()}`,
      `Outstanding: ${this.remainingAmount()}`
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = selected ? `receipt-${selected.referenceNo}.txt` : 'school-fees-full-receipt.txt';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private pause(delayMs: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, delayMs);
    });
  }

  private parseAmount(value: string): number {
    const normalized = (value || '').replace(/[^\d]/g, '');
    return normalized ? Number(normalized) : 0;
  }

  private formatDate(value: Date): string {
    return value.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  private formatNaira(value: number): string {
    return `₦${value.toLocaleString('en-NG')}`;
  }
}
