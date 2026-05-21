import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { FeeItem, ReturningFlowService } from '../../returning-flow.service';

@Component({
  selector: 'app-returning-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, TraceabilityModule],
  providers: [MessageService],
  templateUrl: './returning-payment.component.html',
  styleUrl: './returning-payment.component.scss'
})
export class ReturningPaymentComponent {
  readonly flow = inject(ReturningFlowService);

  private readonly messageService = inject(MessageService);

  readonly mode = signal<'overview' | 'invoice' | 'school-fees'>('overview');

  readonly isSubmitting = signal(false);

  readonly amount = signal(`${this.flow.suggestedAmount()}`);

  readonly schoolFeeAmount = signal(`${this.flow.suggestedSchoolFeeAmount()}`);

  readonly history = computed(() => this.flow.paymentHistory());

  readonly mandatoryFees = computed(() => this.flow.mandatoryFees());

  readonly optionalFees = computed(() => this.flow.optionalFees());

  readonly paymentType = signal('');

  readonly selectedResitCourses = signal<string[]>([]);

  readonly invoiceManualAmount = signal('');

  readonly processingFee = 500;

  readonly paymentTypeOptions = computed(() => [
    ...this.mandatoryFees().map((f) => ({ id: f.id, label: f.name, amount: f.amount })),
    ...this.optionalFees().map((f) => ({ id: f.id, label: f.name, amount: f.amount }))
  ]);

  readonly selectedTypeMeta = computed(() =>
    this.paymentTypeOptions().find((item) => item.id === this.paymentType()) || null
  );

  readonly resitCourseOptions = computed(() =>
    this.flow.resitCourses().map((item) => ({ id: item.code, label: `${item.code} ${item.title}` }))
  );

  readonly invoiceAmount = computed(() => {
    const manual = this.parseAmount(this.invoiceManualAmount());
    if (manual > 0) {
      return manual;
    }
    if (this.paymentType() === 'exam-resit') {
      return this.selectedResitCourses().length * 8000;
    }
    return this.selectedTypeMeta()?.amount || 0;
  });

  readonly invoiceQuantity = computed(() =>
    this.paymentType() === 'exam-resit' ? Math.max(1, this.selectedResitCourses().length) : null
  );

  readonly invoiceTotal = computed(() =>
    this.invoiceAmount() > 0 ? this.invoiceAmount() + this.processingFee : 0
  );

  readonly schoolFeeCardTitle = computed(() => {
    const count = this.flow.schoolFeeInstallments().length;
    if (count === 0) return 'Total school fees';
    if (count === 1) return 'Outstanding Balance';
    return 'Final Balance';
  });

  readonly nextInstallmentLabel = computed(() => {
    const count = this.flow.schoolFeeInstallments().length + 1;
    if (count >= 3) {
      return `3rd Installment (Final Payment)`;
    }
    return count === 1 ? 'Make your 1st payment' : '2nd Installment';
  });

  readonly canProceedInvoice = computed(() =>
    !!this.paymentType() && this.invoiceAmount() > 0 && (this.paymentType() !== 'exam-resit' || this.selectedResitCourses().length > 0)
  );

  async recordPayment(): Promise<void> {
    const amount = this.parseAmount(this.amount());
    const fallback = this.flow.suggestedAmount();
    const finalAmount = amount > 0 ? amount : fallback;

    this.isSubmitting.set(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const result = this.flow.addDummyPayment(finalAmount);
    this.isSubmitting.set(false);

    if (!result.ok) {
      this.messageService.add({ severity: 'warn', summary: 'Payment', detail: result.message });
      return;
    }

    this.amount.set(`${this.flow.suggestedAmount()}`);
    this.messageService.add({ severity: 'success', summary: 'Payment', detail: result.message });
  }

  async payFee(fee: FeeItem): Promise<void> {
    this.isSubmitting.set(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    const result = this.flow.payFee(fee.id);
    this.isSubmitting.set(false);

    this.messageService.add({
      severity: result.ok ? 'success' : 'warn',
      summary: 'Payment',
      detail: result.message
    });
  }

  openInvoiceForFee(fee: FeeItem): void {
    this.paymentType.set(fee.id);
    this.invoiceManualAmount.set(`${fee.amount}`);
    if (fee.id !== 'exam-resit') {
      this.selectedResitCourses.set([]);
    }
    this.mode.set('invoice');
  }

  onPaymentTypeChange(type: string): void {
    this.paymentType.set(type || '');
    const picked = this.paymentTypeOptions().find((item) => item.id === type);
    this.invoiceManualAmount.set(picked ? `${picked.amount}` : '');
    if (type !== 'exam-resit') {
      this.selectedResitCourses.set([]);
    }
  }

  toggleResitCourse(code: string, checked: boolean): void {
    const current = this.selectedResitCourses();
    if (checked && !current.includes(code)) {
      this.selectedResitCourses.set([...current, code]);
      return;
    }
    if (!checked && current.includes(code)) {
      this.selectedResitCourses.set(current.filter((c) => c !== code));
    }
  }

  async proceedInvoicePayment(): Promise<void> {
    if (!this.canProceedInvoice()) {
      return;
    }
    if (this.paymentType() === 'school-fees') {
      this.schoolFeeAmount.set(`${this.flow.suggestedSchoolFeeAmount()}`);
      this.mode.set('school-fees');
      return;
    }

    const feeId = this.paymentType();
    const picked = this.paymentTypeOptions().find((item) => item.id === feeId);
    if (!picked) {
      return;
    }
    this.isSubmitting.set(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    const result = this.flow.payFee(feeId);
    this.isSubmitting.set(false);
    this.messageService.add({
      severity: result.ok ? 'success' : 'warn',
      summary: 'Payment',
      detail: result.message
    });
    if (result.ok) {
      this.mode.set('overview');
    }
  }

  async continueSchoolFeesPayment(): Promise<void> {
    const input = this.parseAmount(this.schoolFeeAmount());
    const fallback = this.flow.suggestedSchoolFeeAmount();
    const amount = input > 0 ? input : fallback;

    this.isSubmitting.set(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const result = this.flow.addSchoolFeeInstallment(amount);
    this.isSubmitting.set(false);
    this.messageService.add({
      severity: result.ok ? 'success' : 'warn',
      summary: 'School Fees',
      detail: result.message
    });
    if (result.ok) {
      this.schoolFeeAmount.set(`${this.flow.suggestedSchoolFeeAmount()}`);
    }
  }

  goToOverview(): void {
    this.mode.set('overview');
  }

  goToInvoice(): void {
    this.paymentType.set('');
    this.invoiceManualAmount.set('');
    this.selectedResitCourses.set([]);
    this.mode.set('invoice');
  }

  goToSchoolFees(): void {
    this.schoolFeeAmount.set(`${this.flow.suggestedSchoolFeeAmount()}`);
    this.mode.set('school-fees');
  }

  isResitSelected(code: string): boolean {
    return this.selectedResitCourses().includes(code);
  }

  statusLabel(fee: FeeItem): string {
    if (fee.status === 'remaining') {
      return `${this.flow.formatCurrency(fee.amount)} remaining`;
    }
    return fee.status === 'paid' ? 'Paid' : 'Unpaid';
  }

  downloadReceipt(referenceNo: string): void {
    const item = this.history().find((entry) => entry.referenceNo === referenceNo);
    if (!item) return;
    const lines = [
      'Payment Receipt',
      `Student: ${this.flow.studentName()}`,
      `Reference: ${item.referenceNo}`,
      `Amount: ${this.flow.formatCurrency(item.amount)}`,
      `Date: ${item.paidAt.toLocaleDateString('en-GB')}`
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${item.referenceNo}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private parseAmount(value: string): number {
    const cleaned = (value || '').replace(/[^\d]/g, '');
    return cleaned ? Number(cleaned) : 0;
  }
}
