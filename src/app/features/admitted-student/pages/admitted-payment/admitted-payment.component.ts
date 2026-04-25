import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AdmittedFlowService } from '../../admitted-flow.service';
import { TraceabilityModule } from '../../../../shared/traceability.module';

@Component({
  selector: 'app-admitted-payment',
  standalone: true,
  imports: [CommonModule, TraceabilityModule],
  providers: [MessageService],
  templateUrl: './admitted-payment.component.html',
  styleUrl: './admitted-payment.component.scss'
})
export class AdmittedPaymentComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  readonly flow = inject(AdmittedFlowService);

  readonly isProcessing = signal(false);
  readonly amountToPay = signal('');
  readonly paymentHistory = computed(() => this.flow.schoolFeePayments());
  readonly totalPaid = computed(() => this.formatNaira(this.flow.paidSchoolFees()));
  readonly remainingAmount = computed(() => this.formatNaira(this.flow.remainingSchoolFees()));
  readonly amountFieldLabel = computed(() =>
    this.paymentHistory().length === 0 ? 'Make your 1st payment' : 'Continue with next installment'
  );
  readonly suggestedAmount = computed(() => this.formatNaira(this.flow.suggestedInstallmentAmount()));

  ngOnInit(): void {
    void this.flow.loadSnapshot();
    if (this.paymentHistory().length === 0) {
      this.amountToPay.set(`${this.flow.suggestedInstallmentAmount()}`);
    }
  }

  async proceedToPayment(): Promise<void> {
    const value = this.parseAmount(this.amountToPay());
    const fallback = this.flow.suggestedInstallmentAmount();
    const amount = value > 0 ? value : fallback;

    this.isProcessing.set(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const result = this.flow.addDummySchoolFeePayment(amount);
    this.isProcessing.set(false);

    if (!result.ok) {
      this.messageService.add({ severity: 'warn', summary: 'Payment', detail: result.message });
      return;
    }

    this.amountToPay.set(`${this.flow.suggestedInstallmentAmount()}`);
    this.messageService.add({ severity: 'success', summary: 'Payment', detail: result.message });
  }

  proceedToCourseRegistration(): void {
    void this.router.navigateByUrl('/admitted/courses');
  }

  downloadReceipt(referenceNo?: string): void {
    const selected = referenceNo
      ? this.paymentHistory().find((item) => item.referenceNo === referenceNo) || null
      : null;
    const entries = selected ? [selected] : this.paymentHistory();
    const title = selected ? 'School Fees Receipt' : 'Full School Fees Receipt';

    const lines = [
      title,
      `Student: ${this.flow.applicantName()}`,
      `Application No: ${this.flow.applicationNo()}`,
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
