import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StudentFeePlan } from '../../data/application/student-fees.dto';
import { ApplicationService } from '../../services/application.service';
import { RegistrantData } from '../../data/application/registrantdatadto';
import { AuthSessionStore } from '../../store/auth-session.store';
import { formatStructuredName } from '../../utility/name-format';
import {
  readStudentFeeInstallmentAmount,
  readStudentFeeInstallmentNumbers,
  selectMatchingStudentFeePlan,
} from '../../utility/student-fees-plan';

export type VerificationDocument = {
  label: string;
  fileName: string;
  uploaded: boolean;
};

export type SchoolFeePaymentRecord = {
  installmentLabel: string;
  referenceNo: string;
  amount: number;
  paidAt: Date;
};

const DEFAULT_STUDENT_FEE_TOTAL = 600000;
const DEFAULT_STUDENT_FEE_FIRST_INSTALLMENT = 500000;
const DEFAULT_STUDENT_FEE_INSTALLMENTS = 3;
const ADMITTED_LEVEL_ID = 1;

@Injectable({ providedIn: 'root' })
export class AdmittedFlowService {
  private readonly appService = inject(ApplicationService);

  private readonly authSessionStore = inject(AuthSessionStore);

  readonly loadingSnapshot = signal(false);

  readonly loadingStudentFeePlan = signal(false);

  readonly registrantData = signal<RegistrantData | null>(null);

  readonly studentFeePlan = signal<StudentFeePlan | null>(null);

  readonly schoolFeePayments = signal<SchoolFeePaymentRecord[]>([]);

  readonly acceptanceFee = 30000;

  readonly processingFee = 500;

  readonly totalPay = computed(() => this.acceptanceFee + this.processingFee);

  readonly totalSchoolFees = computed(() => this.studentFeePlan()?.amount || DEFAULT_STUDENT_FEE_TOTAL);

  readonly maxInstallments = computed(() => {
    const configuredInstallments = readStudentFeeInstallmentNumbers(this.studentFeePlan());
    return configuredInstallments.length || DEFAULT_STUDENT_FEE_INSTALLMENTS;
  });

  readonly minFirstInstallment = computed(() =>
    readStudentFeeInstallmentAmount(this.studentFeePlan(), 1) ?? DEFAULT_STUDENT_FEE_FIRST_INSTALLMENT
  );

  readonly applicantName = computed(() => {
    const data = this.registrantData();
    const fallback = this.authSessionStore.name();
    const composed = formatStructuredName({
      firstName: data?.first_name,
      lastName: data?.last_name,
      middleName: data?.other_names
    });
    return composed || fallback || 'Applicant';
  });

  readonly applicationNo = computed(
    () => this.registrantData()?.application_no || this.authSessionStore.applicationNo() || '—'
  );

  readonly programName = computed(
    () => this.registrantData()?.department?.name || this.registrantData()?.program?.name || '—'
  );

  readonly academicSession = computed(() => this.registrantData()?.session?.name || '—');

  readonly admissionDate = computed(() => {
    const data = this.registrantData();
    return this.formatDate(data?.updated_at || data?.created_at);
  });

  readonly paymentStatus = computed(() => {
    const dataStatus = this.registrantData()?.payment_status || '';
    const sessionStatus = this.authSessionStore.paymentStatus() || '';
    return dataStatus || sessionStatus;
  });

  readonly acceptanceFeeStatus = computed(() => {
    const registrantStatus = this.readAcceptanceFeeStatusFromRegistrant();
    const sessionStatus = this.authSessionStore.acceptanceFeeStatus() || '';
    return registrantStatus || sessionStatus;
  });

  readonly isAcceptancePaid = computed(() => this.isPaidStatus(this.acceptanceFeeStatus()));

  readonly transactionReference = computed(
    () => this.authSessionStore.paymentRef() || this.applicationNo()
  );

  readonly paymentDateTime = computed(() => {
    const data = this.registrantData();
    const raw = data?.updated_at || data?.created_at;
    if (!raw) {
      return '—';
    }
    const date = new Date(raw);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  readonly receiptUrl = computed(() => this.registrantData()?.payment_slip?.file_url || '');

  readonly profilePhotoUrl = computed(() => this.registrantData()?.passport_photo?.file_url || '');

  readonly paidSchoolFees = computed(() =>
    this.schoolFeePayments().reduce((sum, payment) => sum + payment.amount, 0)
  );

  readonly remainingSchoolFees = computed(() => Math.max(0, this.totalSchoolFees() - this.paidSchoolFees()));

  readonly isSchoolFeesFullyPaid = computed(() => this.remainingSchoolFees() <= 0);

  readonly schoolFeeProgressPercent = computed(() => {
    const ratio = this.paidSchoolFees() / this.totalSchoolFees();
    return Math.max(0, Math.min(100, Math.round(ratio * 100)));
  });

  readonly schoolFeeCardTitle = computed(() => {
    if (this.isSchoolFeesFullyPaid()) {
      return 'Payment Completed';
    }
    if (this.remainingSchoolFees() <= 50000 && this.schoolFeePayments().length >= 2) {
      return 'Final Balance';
    }
    if (this.schoolFeePayments().length > 0) {
      return 'Outstanding Balance';
    }
    return 'Total school fees';
  });

  readonly schoolFeeMainValue = computed(() => {
    if (this.isSchoolFeesFullyPaid()) {
      return 'Fully Paid';
    }
    return this.formatCurrency(this.remainingSchoolFees() || this.totalSchoolFees());
  });

  readonly canAddInstallment = computed(
    () => this.resolveNextInstallmentAmount() > 0
      && this.schoolFeePayments().length < this.maxInstallments()
      && this.remainingSchoolFees() > 0
  );

  readonly hasInternalPayment = computed(() => this.schoolFeePayments().length > 0);

  readonly canAccessProfileVerification = computed(() => this.hasInternalPayment());

  readonly verificationDocuments = computed<VerificationDocument[]>(() => {
    const data = this.registrantData();
    const oLevelFile = data?.o_level_result?.[0]?.file?.file_name || '';
    const utmeFile = data?.utme_result?.file?.file_name || '';
    const birthFile = data?.certificate_of_birth?.file_name || '';
    const recFile = data?.academic_history?.[0]?.certificate?.file_name || '';
    const testimonialFile = data?.certificate_of_origin?.file_name || '';

    return [
      { label: 'Client Result', fileName: oLevelFile, uploaded: !!oLevelFile },
      { label: 'Certificate of Birth', fileName: birthFile, uploaded: !!birthFile },
      { label: 'UTME Result', fileName: utmeFile, uploaded: !!utmeFile },
      { label: 'Letter of Recommendation', fileName: recFile, uploaded: !!recFile },
      { label: 'Secondary School Testimonial', fileName: testimonialFile, uploaded: !!testimonialFile }
    ];
  });

  async loadSnapshot(): Promise<void> {
    const appNo = this.authSessionStore.applicationNo() || '';
    if (!appNo) {
      this.registrantData.set(null);
      return;
    }

    this.loadingSnapshot.set(true);
    try {
      const response = await firstValueFrom(this.appService.registrantData(appNo));
      const data = response?.data ?? null;
      this.registrantData.set(data);
      this.authSessionStore.syncRegistrantSession(data);
      await this.loadStudentFeePlan();
    } finally {
      this.loadingSnapshot.set(false);
    }
  }

  async loadStudentFeePlan(): Promise<void> {
    this.loadingStudentFeePlan.set(true);
    try {
      const response = await firstValueFrom(this.appService.getStudentFeePlans());
      const departmentId = this.registrantData()?.department?.id ?? null;
      const selectedPlan = selectMatchingStudentFeePlan(response.data, departmentId, ADMITTED_LEVEL_ID);
      this.studentFeePlan.set(selectedPlan);
    } finally {
      this.loadingStudentFeePlan.set(false);
    }
  }

  recordVerifiedSchoolFeePayment(amount: number, reference?: string): { ok: boolean; message: string } {
    if (!this.canAddInstallment()) {
      return { ok: false, message: 'No pending installment at the moment.' };
    }

    const trimmedAmount = Math.floor(amount);
    const paymentCount = this.schoolFeePayments().length;
    const remaining = this.remainingSchoolFees();

    if (!Number.isFinite(trimmedAmount) || trimmedAmount <= 0) {
      return { ok: false, message: 'Enter a valid amount.' };
    }

    if (paymentCount === 0 && trimmedAmount < this.minFirstInstallment()) {
      return { ok: false, message: `First payment minimum is ${this.formatCurrency(this.minFirstInstallment())}.` };
    }

    if (trimmedAmount > remaining) {
      return { ok: false, message: `Amount cannot be more than ${this.formatCurrency(remaining)}.` };
    }

    const installmentNo = paymentCount + 1;
    const finalInstallment = remaining - trimmedAmount <= 0 || installmentNo >= this.maxInstallments();
    const installmentLabel = finalInstallment
      ? `${installmentNo}${this.ordinalSuffix(installmentNo)} Installment${installmentNo >= this.maxInstallments() ? ' (Final Payment)' : ''}`
      : `${installmentNo}${this.ordinalSuffix(installmentNo)} Installment`;
    const createdAt = new Date();
    const resolvedReference = reference || this.authSessionStore.paymentRef() || this.generateReference(createdAt);

    const nextList = [
      ...this.schoolFeePayments(),
      {
        installmentLabel,
        referenceNo: resolvedReference,
        amount: trimmedAmount,
        paidAt: createdAt
      }
    ];
    this.schoolFeePayments.set(nextList);
    this.authSessionStore.setPaymentRef(resolvedReference);
    this.authSessionStore.setPaymentStatus('paid');

    return { ok: true, message: `${installmentLabel} recorded successfully.` };
  }

  suggestedInstallmentAmount(): number {
    return this.resolveNextInstallmentAmount();
  }

  private isPaidStatus(status: string): boolean {
    const normalized = (status || '').toLowerCase().trim();
    if (!normalized) {
      return false;
    }
    if (normalized.includes('unpaid') || normalized.includes('pending') || normalized.includes('no payment')) {
      return false;
    }
    return normalized.includes('paid') || normalized.includes('complete') || normalized.includes('success');
  }

  private readAcceptanceFeeStatusFromRegistrant(): string {
    return this.registrantData()?.acceptance_fee_status ?? '';
  }

  private formatDate(value: string | Date | undefined): string {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }
    return date.toLocaleDateString('en-GB');
  }

  private formatCurrency(value: number): string {
    return `₦${value.toLocaleString('en-NG')}`;
  }

  private resolveNextInstallmentAmount(): number {
    const nextInstallmentNumber = this.schoolFeePayments().length + 1;
    const configuredAmount = readStudentFeeInstallmentAmount(this.studentFeePlan(), nextInstallmentNumber);
    if (configuredAmount !== null) {
      return configuredAmount;
    }

    const remaining = this.remainingSchoolFees();
    if (remaining <= 0) {
      return 0;
    }
    if (this.schoolFeePayments().length === 0) {
      return Math.min(this.minFirstInstallment(), remaining);
    }
    return remaining;
  }

  private generateReference(date: Date): string {
    const year = date.getFullYear();
    const suffix = Math.floor(100000 + Math.random() * 900000);
    return `REM-${year}-${suffix}`;
  }

  private ordinalSuffix(n: number): string {
    if (n % 10 === 1 && n % 100 !== 11) return 'st';
    if (n % 10 === 2 && n % 100 !== 12) return 'nd';
    if (n % 10 === 3 && n % 100 !== 13) return 'rd';
    return 'th';
  }
}
