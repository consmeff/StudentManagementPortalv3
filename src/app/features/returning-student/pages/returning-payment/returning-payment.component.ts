import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { PaymentWorkflowService } from '../../../../services/payment-workflow.service';
import { buildStudentFeePaymentPayloadForAmount } from '../../../../utility/student-fees-plan';
import { ReturningFlowService } from '../../returning-flow.service';

@Component({
  selector: 'app-returning-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, TraceabilityModule],
  providers: [MessageService],
  templateUrl: './returning-payment.component.html',
  styleUrl: './returning-payment.component.scss'
})
export class ReturningPaymentComponent implements OnInit {
  private readonly router = inject(Router);

  private readonly messageService = inject(MessageService);

  private readonly paymentWorkflow = inject(PaymentWorkflowService);

  readonly flow = inject(ReturningFlowService);

  readonly isProcessing = signal(false);

  readonly amountToPay = signal('');

  readonly paymentHistory = computed(() => this.flow.schoolFeeInstallments());

  readonly totalPaid = computed(() => this.formatNaira(this.flow.schoolFeesPaid()));

  readonly remainingAmount = computed(() => this.formatNaira(this.flow.schoolFeesRemaining()));

  readonly amountFieldLabel = computed(() =>
    this.flow.schoolFeePaymentCount() === 0 ? 'Make your 1st payment' : 'Continue with next installment'
  );

  readonly minimumAllowedAmount = computed(() => this.flow.suggestedSchoolFeeAmount());

  readonly maximumAllowedAmount = computed(() => this.flow.schoolFeesRemaining());

  readonly suggestedAmount = computed(() => this.formatNaira(this.flow.suggestedSchoolFeeAmount()));

  readonly paymentValidationMessage = computed(() => this.validateAmountInput(this.amountToPay()));

  readonly canSubmitPayment = computed(() => this.paymentValidationMessage() === null && !!this.flow.studentFeePlan());

  readonly schoolFeeCardTitle = computed(() => {
    if (!this.flow.canAddSchoolFeeInstallment()) {
      return 'Payment Completed';
    }
    if (this.flow.schoolFeesRemaining() <= 50000 && this.flow.schoolFeePaymentCount() >= 2) {
      return 'Final Balance';
    }
    if (this.flow.schoolFeePaymentCount() > 0) {
      return 'Outstanding Balance';
    }
    return 'Total school fees';
  });

  readonly schoolFeeMainValue = computed(() => {
    if (!this.flow.canAddSchoolFeeInstallment()) {
      return 'Fully Paid';
    }
    return this.formatNaira(this.flow.schoolFeesRemaining() || this.flow.configuredTotalSchoolFees());
  });

  ngOnInit(): void {
    this.flow.loadStudentFeePlan()
      .then(() => {
        this.amountToPay.set(`${this.flow.suggestedSchoolFeeAmount()}`);
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

    const payload = buildStudentFeePaymentPayloadForAmount(plan, amount);

    try {
      await this.paymentWorkflow.startStudentFeesPayment(payload, {
        onProcessingChange: (processing) => this.isProcessing.set(processing),
        onVerifyingChange: (verifying) => this.isProcessing.set(verifying),
        onSuccess: (title, message) => this.messageService.add({ severity: 'success', summary: title, detail: message }),
        onError: (title, message) => this.messageService.add({ severity: 'error', summary: title, detail: message }),
        onWarning: (title, message) => this.messageService.add({ severity: 'warn', summary: title, detail: message }),
        onVerified: (reference) => {
          const result = this.flow.recordVerifiedSchoolFeeInstallment(amount, reference);
          if (!result.ok) {
            this.messageService.add({ severity: 'warn', summary: 'Payment', detail: result.message });
          }
          this.amountToPay.set(`${this.flow.suggestedSchoolFeeAmount()}`);
        },
        postVerifyNavigateTo: '/returning/payment'
      });
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Payment',
        detail: 'Unable to start school fee payment right now.'
      });
    }
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
