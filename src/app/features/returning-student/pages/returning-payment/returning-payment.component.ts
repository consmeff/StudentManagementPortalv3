import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { PaymentWorkflowService } from '../../../../services/payment-workflow.service';
import { buildStudentFeePaymentPayloadForAmount } from '../../../../utility/student-fees-plan';
import { ReturningFlowService } from '../../returning-flow.service';

type PaymentPageView = 'overview' | 'history' | 'invoice' | 'school-fee';

const RETURNING_PAYMENT_FLOW_QUERY_PARAM = 'flow';
const RETURNING_SCHOOL_FEE_FLOW = 'school-fee';

@Component({
  selector: 'app-returning-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, TraceabilityModule],
  providers: [MessageService],
  templateUrl: './returning-payment.component.html',
  styleUrl: './returning-payment.component.scss'
})
export class ReturningPaymentComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly messageService = inject(MessageService);

  private readonly paymentWorkflow = inject(PaymentWorkflowService);

  readonly flow = inject(ReturningFlowService);

  readonly isProcessing = signal(false);

  readonly amountToPay = signal('');

  readonly currentView = signal<PaymentPageView>('overview');

  readonly selectedFeeId = signal<string | null>(null);

  readonly selectedResitCourseCodes = signal<string[]>([]);

  readonly processingFee = 500;

  readonly hasPendingSchoolFeePayment = computed(() => this.flow.schoolFeesRemaining() > 0);

  readonly schoolFeePaymentHistory = computed(() => this.flow.schoolFeeInstallments());

  readonly paymentHistory = computed(() =>
    [...this.flow.paymentHistory()].sort((left, right) => right.paidAt.getTime() - left.paidAt.getTime())
  );

  readonly nonSchoolFeeOptions = computed(() =>
    this.flow.fees().filter((fee) => fee.id !== 'school-fees')
  );

  readonly invoiceOptions = computed(() =>
    this.nonSchoolFeeOptions().filter((fee) => fee.status !== 'paid')
  );

  readonly selectedFee = computed(() =>
    this.flow.fees().find((fee) => fee.id === this.selectedFeeId()) ?? null
  );

  readonly resitCourseOptions = computed(() => this.flow.resitCourses());

  readonly requiresCourseSelection = computed(() => this.selectedFee()?.id === 'exam-resit');

  readonly selectedResitCourseCount = computed(() => this.selectedResitCourseCodes().length);

  readonly invoiceAmount = computed(() => {
    const fee = this.selectedFee();
    if (!fee) {
      return 0;
    }
    if (fee.id === 'exam-resit') {
      return fee.amount * this.selectedResitCourseCount();
    }
    return fee.amount;
  });

  readonly invoiceProcessingFee = computed(() => this.invoiceAmount() > 0 ? this.processingFee : 0);

  readonly invoiceTotal = computed(() => this.invoiceAmount() + this.invoiceProcessingFee());

  readonly canProceedInvoicePayment = computed(() => {
    const fee = this.selectedFee();
    if (!fee) {
      return false;
    }
    if (this.requiresCourseSelection() && this.selectedResitCourseCount() === 0) {
      return false;
    }
    return this.invoiceAmount() > 0;
  });

  readonly pageTitle = computed(() => {
    switch (this.currentView()) {
      case 'history':
        return 'Payment History';
      case 'invoice':
        return 'Invoice Generation';
      case 'school-fee':
        return 'School Fees Payment';
      default:
        return 'Payments';
    }
  });

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
    void Promise.allSettled([
      this.flow.loadStudentDashboard(),
      this.flow.loadStudentFeePlan()
    ]).then(() => {
      this.amountToPay.set(`${this.flow.suggestedSchoolFeeAmount()}`);
      this.currentView.set(this.resolveInitialView());
    });
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
          this.currentView.set('school-fee');
        },
        postVerifyNavigateTo: '/returning/payment?flow=school-fee'
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

  openOverview(): void {
    this.currentView.set('overview');
    this.syncRouteFlow(null);
  }

  openHistory(): void {
    this.currentView.set('history');
    this.syncRouteFlow(null);
  }

  openSchoolFeePayment(): void {
    if (!this.hasPendingSchoolFeePayment()) {
      this.openOverview();
      return;
    }
    this.currentView.set('school-fee');
    this.amountToPay.set(`${this.flow.suggestedSchoolFeeAmount()}`);
    this.syncRouteFlow(RETURNING_SCHOOL_FEE_FLOW);
  }

  openInvoiceForFee(feeId: string): void {
    const fee = this.flow.fees().find((item) => item.id === feeId) ?? null;
    if (!fee || fee.status === 'paid') {
      return;
    }
    this.selectedFeeId.set(feeId);
    this.selectedResitCourseCodes.set([]);
    this.currentView.set('invoice');
    this.syncRouteFlow(null);
  }

  onPaymentTypeChange(value: string): void {
    this.selectedFeeId.set(value || null);
    this.selectedResitCourseCodes.set([]);
  }

  toggleResitCourse(courseCode: string, checked: boolean): void {
    const current = this.selectedResitCourseCodes();
    if (checked && !current.includes(courseCode)) {
      this.selectedResitCourseCodes.set([...current, courseCode]);
      return;
    }
    if (!checked && current.includes(courseCode)) {
      this.selectedResitCourseCodes.set(current.filter((item) => item !== courseCode));
    }
  }

  isResitCourseSelected(courseCode: string): boolean {
    return this.selectedResitCourseCodes().includes(courseCode);
  }

  proceedWithInvoicePayment(): void {
    const fee = this.selectedFee();
    if (!fee) {
      return;
    }
    if (fee.id === 'school-fees') {
      this.openSchoolFeePayment();
      return;
    }
    if (fee.status === 'paid') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Payment',
        detail: `${fee.name} has already been paid.`
      });
      this.currentView.set('overview');
      return;
    }
    if (!this.canProceedInvoicePayment()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Payment',
        detail: this.requiresCourseSelection()
          ? 'Select at least one resit course before proceeding.'
          : 'Payment amount is not ready yet.'
      });
      return;
    }

    const paymentType = fee.id === 'exam-resit'
      ? `Exam Resit (${this.selectedResitCourseCount()} course${this.selectedResitCourseCount() === 1 ? '' : 's'})`
      : fee.name;

    const result = this.flow.recordAuxiliaryFeePayment(fee.id, this.invoiceTotal(), paymentType);
    if (!result.ok) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Payment',
        detail: result.message
      });
      return;
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Payment',
      detail: result.message
    });
    this.currentView.set('overview');
  }

  downloadSchoolFeeReceipt(referenceNo?: string): void {
    const selected = referenceNo
      ? this.schoolFeePaymentHistory().find((item) => item.referenceNo === referenceNo) || null
      : null;
    const entries = selected ? [selected] : this.schoolFeePaymentHistory();
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

  downloadFeeReceipt(feeId: string): void {
    const entries = this.paymentHistory().filter((item) => item.feeId === feeId);
    if (entries.length === 0) {
      return;
    }
    this.downloadGenericReceipt(entries, `${feeId}-receipt.txt`);
  }

  downloadHistoryReceipt(referenceNo: string): void {
    const entry = this.paymentHistory().find((item) => item.referenceNo === referenceNo);
    if (!entry) {
      return;
    }
    this.downloadGenericReceipt([entry], `receipt-${referenceNo}.txt`);
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

  paidAmountLabel(amount: number): string {
    return this.formatNaira(amount);
  }

  feeAmountLabel(feeId: string, amount: number): string {
    if (feeId === 'school-fees') {
      return this.formatNaira(this.flow.configuredTotalSchoolFees());
    }
    if (feeId === 'exam-resit') {
      return `${this.formatNaira(amount)} per course`;
    }
    return this.formatNaira(amount);
  }

  feeStatusLabel(feeId: string, status: string): string {
    if (feeId === 'school-fees') {
      if (!this.flow.canAddSchoolFeeInstallment()) {
        return 'Paid';
      }
      return `${this.formatNaira(this.flow.schoolFeesRemaining())} remaining`;
    }
    return status === 'paid' ? 'Paid' : 'Unpaid';
  }

  feeStatusClass(feeId: string, status: string): string {
    if (feeId === 'school-fees') {
      return this.flow.canAddSchoolFeeInstallment() ? 'status-chip status-warning' : 'status-chip status-success';
    }
    return status === 'paid' ? 'status-chip status-success' : 'status-chip status-danger';
  }

  canDownloadReceipt(feeId: string, status: string): boolean {
    if (feeId === 'school-fees') {
      return status === 'paid';
    }
    return status === 'paid' && this.paymentHistory().some((item) => item.feeId === feeId);
  }

  invoicePaymentTypeLabel(): string {
    const fee = this.selectedFee();
    if (!fee) {
      return '—';
    }
    if (fee.id === 'exam-resit') {
      return `Exam Resit${this.selectedResitCourseCount() > 0 ? ` (${this.selectedResitCourseCount()} Course${this.selectedResitCourseCount() === 1 ? '' : 's'})` : ''}`;
    }
    return fee.name;
  }

  private resolveInitialView(): PaymentPageView {
    const requestedFlow = this.route.snapshot.queryParamMap.get(RETURNING_PAYMENT_FLOW_QUERY_PARAM);
    if (requestedFlow === RETURNING_SCHOOL_FEE_FLOW && this.hasPendingSchoolFeePayment()) {
      return 'school-fee';
    }
    return 'overview';
  }

  private validateAmountInput(value: string): string | null {
    return this.validateAmountValue(this.parseAmount(value));
  }

  private syncRouteFlow(flow: string | null): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: flow ? { [RETURNING_PAYMENT_FLOW_QUERY_PARAM]: flow } : {},
      replaceUrl: true
    }).catch(() => {});
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

  private downloadGenericReceipt(
    entries: Array<{ paymentType: string; referenceNo: string; amount: number; paidAt: Date }>,
    fileName: string
  ): void {
    const lines = [
      'Payment Receipt',
      `Student: ${this.flow.studentName()}`,
      `Matric No: ${this.flow.matricNo()}`,
      ...entries.flatMap((entry) => [
        `Payment Type: ${entry.paymentType}`,
        `Ref No: ${entry.referenceNo}`,
        `Amount: ${this.formatNaira(entry.amount)}`,
        `Date: ${this.formatDate(entry.paidAt)}`
      ])
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
