import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AdmittedFlowService } from '../../admitted-flow.service';
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { PaymentWorkflowService } from '../../../../services/payment-workflow.service';
import { buildStudentFeePaymentPayloadForAmount } from '../../../../utility/student-fees-plan';

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

  private readonly paymentWorkflow = inject(PaymentWorkflowService);

  readonly flow = inject(AdmittedFlowService);

  readonly isProcessing = signal(false);

  readonly amountToPay = signal('');

  readonly paymentHistory = computed(() => this.flow.schoolFeePayments());

  readonly totalPaid = computed(() => this.formatNaira(this.flow.paidSchoolFees()));

  readonly remainingAmount = computed(() => this.formatNaira(this.flow.remainingSchoolFees()));

  readonly amountFieldLabel = computed(() =>
    this.flow.schoolFeePaymentCount() === 0 ? 'Make your 1st payment' : 'Continue with next installment'
  );

  readonly minimumAllowedAmount = computed(() => this.flow.suggestedInstallmentAmount());

  readonly maximumAllowedAmount = computed(() => this.flow.remainingSchoolFees());

  readonly suggestedAmount = computed(() => this.formatNaira(this.flow.suggestedInstallmentAmount()));

  readonly paymentValidationMessage = computed(() => this.validateAmountInput(this.amountToPay()));

  readonly canSubmitPayment = computed(() => this.paymentValidationMessage() === null && !!this.flow.studentFeePlan());

  ngOnInit(): void {
    this.flow.loadSnapshot()
      .then(() => {
        this.amountToPay.set(`${this.flow.suggestedInstallmentAmount()}`);
      })
      .catch(() => {});
  }

  async proceedToPayment(): Promise<void> {
    const plan = this.flow.studentFeePlan();
    if (!plan) {
      this.messageService.add({
        severity: 'error',
        summary: 'Payment',
        detail: 'School fee installment plan is not available right now.'
      });
      return;
    }

    const amount = this.parseAmount(this.amountToPay());
    const validationMessage = this.validateAmountValue(amount);
    if (validationMessage) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Payment',
        detail: validationMessage
      });
      return;
    }

    const applicationNo = this.flow.applicationNo();
    const applicantNo = applicationNo === '—' ? undefined : applicationNo;
    const payload = buildStudentFeePaymentPayloadForAmount(plan, amount);

    try {
      await this.paymentWorkflow.startStudentFeesPayment(payload, {
        onProcessingChange: (processing) => this.isProcessing.set(processing),
        onVerifyingChange: (verifying) => this.isProcessing.set(verifying),
        onSuccess: (title, message) => this.messageService.add({ severity: 'success', summary: title, detail: message }),
        onError: (title, message) => this.messageService.add({ severity: 'error', summary: title, detail: message }),
        onWarning: (title, message) => this.messageService.add({ severity: 'warn', summary: title, detail: message }),
        onVerified: (reference) => {
          const result = this.flow.recordVerifiedSchoolFeePayment(amount, reference);
          if (!result.ok) {
            this.messageService.add({ severity: 'warn', summary: 'Payment', detail: result.message });
          }
          this.amountToPay.set(`${this.flow.suggestedInstallmentAmount()}`);
          this.flow.loadSnapshot().catch(() => {});
        },
        postVerifyNavigateTo: '/admitted/payment'
      }, applicantNo);
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Payment',
        detail: 'Unable to start school fee payment right now.'
      });
    }
  }

  proceedToCourseRegistration(): void {
    this.router.navigateByUrl('/admitted/courses').catch(() => {});
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

  onAmountChange(value: string): void {
    this.amountToPay.set(this.keepNumericValue(value));
  }

  onAmountKeyDown(event: KeyboardEvent): void {
    if (this.isAllowedControlKey(event)) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onAmountPaste(event: ClipboardEvent): void {
    const pastedValue = event.clipboardData?.getData('text') ?? '';
    if (!/^\d+$/.test(pastedValue)) {
      event.preventDefault();
    }
  }

  minimumAmountHint(): string {
    return this.formatNaira(this.minimumAllowedAmount());
  }

  maximumAmountHint(): string {
    return this.formatNaira(this.maximumAllowedAmount());
  }

  private validateAmountInput(value: string): string | null {
    return this.validateAmountValue(this.parseAmount(value));
  }

  private validateAmountValue(value: number): string | null {
    if (!Number.isFinite(value) || value <= 0) {
      return 'Enter a valid numeric amount.';
    }
    if (value < this.minimumAllowedAmount()) {
      return `Amount cannot be less than ${this.minimumAmountHint()}.`;
    }
    if (value > this.maximumAllowedAmount()) {
      return `Amount cannot be more than ${this.maximumAmountHint()}.`;
    }
    return null;
  }

  private keepNumericValue(value: string): string {
    return (value || '').replace(/[^\d]/g, '');
  }

  private isAllowedControlKey(event: KeyboardEvent): boolean {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    return allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey;
  }

  private parseAmount(value: string): number {
    const normalized = this.keepNumericValue(value);
    return normalized ? Number(normalized) : 0;
  }

  private formatDate(value: Date): string {
    return value.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  private formatNaira(value: number): string {
    return `₦${value.toLocaleString('en-NG')}`;
  }
}
