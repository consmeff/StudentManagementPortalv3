import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StudentFeePlan, StudentSchoolFeeStatus } from '../../data/application/student-fees.dto';
import { ApplicationService } from '../../services/application.service';
import { RegistrantData, StudentSingleData } from '../../data/application/registrantdatadto';
import { AuthSessionStore } from '../../store/auth-session.store';
import { formatStructuredName } from '../../utility/name-format';
import {
  readStudentFeeInstallmentAmount,
  readStudentFeeInstallmentNumbers,
  selectMatchingStudentFeePlan,
} from '../../utility/student-fees-plan';
import { AvailableCourse, RegisteredCourse, flattenRegisteredCoursesResponse } from '../../data/application/courseregistration.dto';

type AdmissionDocumentType = 'recommendation_letter_1' | 'recommendation_letter_2' | 'testimonial';

export type VerificationDocument = {
  label: string;
  fileName: string;
  fileUrl: string;
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

@Injectable({ providedIn: 'root' })
export class AdmittedFlowService {
  private readonly appService = inject(ApplicationService);

  private readonly authSessionStore = inject(AuthSessionStore);

  readonly loadingSnapshot = signal(false);

  readonly loadingStudentFeePlan = signal(false);

  readonly loadingCourses = signal(false);

  readonly uploadingDocument = signal<string | null>(null);

  readonly uploadedRecommendationLetter1 = signal<any>(null);

  readonly uploadedRecommendationLetter2 = signal<any>(null);

  readonly uploadedTestimonial = signal<any>(null);

  readonly submittingProfileDocuments = signal(false);

  readonly registrantData = signal<RegistrantData | null>(null);

  readonly studentProfile = computed(() => this.authSessionStore.studentProfile());

  readonly removedAdmissionDocuments = signal<AdmissionDocumentType[]>([]);

  readonly studentFeePlan = signal<StudentFeePlan | null>(null);

  readonly studentSchoolFeeStatus = signal<StudentSchoolFeeStatus | null>(null);

  readonly schoolFeePayments = signal<SchoolFeePaymentRecord[]>([]);

  readonly availableCourses = signal<AvailableCourse[]>([]);

  readonly selectedCourseIds = signal<number[]>([]);

  readonly registrationSubmitted = signal(false);

  readonly registeredCourses = signal<RegisteredCourse[]>([]);

  readonly acceptanceFee = 30000;

  readonly processingFee = 500;

  readonly totalPay = computed(() => this.acceptanceFee + this.processingFee);

  readonly totalSchoolFees = computed(() =>
    this.studentSchoolFeeStatus()?.amount ?? this.studentFeePlan()?.amount ?? DEFAULT_STUDENT_FEE_TOTAL
  );

  readonly maxInstallments = computed(() => {
    const configuredInstallments = readStudentFeeInstallmentNumbers(this.studentFeePlan());
    return configuredInstallments.length || DEFAULT_STUDENT_FEE_INSTALLMENTS;
  });

  readonly minFirstInstallment = computed(() =>
    readStudentFeeInstallmentAmount(this.studentFeePlan(), 1) ?? DEFAULT_STUDENT_FEE_FIRST_INSTALLMENT
  );

  readonly schoolFeePaymentCount = computed(() =>
    this.studentSchoolFeeStatus()?.payment_status.number_of_payments ?? this.schoolFeePayments().length
  );

  readonly applicantName = computed(() => {
    const student = this.studentProfile();
    if (student) {
      const fullName = [student.first_name, student.other_names, student.last_name].filter((value) => !!(value || '').trim()).join(' ');
      return fullName || this.authSessionStore.name() || 'Student';
    }
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
    () => this.studentProfile()?.matriculation_number
      || this.registrantData()?.matriculation_no
      || this.registrantData()?.application_no
      || this.authSessionStore.matriculationNo()
      || this.authSessionStore.applicationNo()
      || '—'
  );

  readonly programName = computed(
    () => this.studentProfile()?.department?.name
      || this.registrantData()?.department?.name
      || this.registrantData()?.program?.name
      || '—'
  );

  readonly academicSession = computed(() =>
    this.studentProfile()?.session?.name
    || this.registrantData()?.session?.name
    || '—'
  );

  readonly levelName = computed(() => this.studentProfile()?.level?.name || 'ND 1');

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

  readonly profilePhotoUrl = computed(() =>
    this.studentProfile()?.passport_photo?.file_url
    || this.registrantData()?.passport_photo?.file_url
    || ''
  );

  readonly paidSchoolFees = computed(() =>
    this.studentSchoolFeeStatus()?.payment_status.total_paid
    ?? this.schoolFeePayments().reduce((sum, payment) => sum + payment.amount, 0)
  );

  readonly remainingSchoolFees = computed(() =>
    this.studentSchoolFeeStatus()?.payment_status.total_due
    ?? Math.max(0, this.totalSchoolFees() - this.paidSchoolFees())
  );

  readonly isSchoolFeesFullyPaid = computed(() => this.remainingSchoolFees() <= 0);

  readonly schoolFeeProgressPercent = computed(() => {
    const ratio = this.paidSchoolFees() / this.totalSchoolFees();
    return Math.max(0, Math.min(100, Math.round(ratio * 100)));
  });

  readonly schoolFeeCardTitle = computed(() => {
    if (this.isSchoolFeesFullyPaid()) {
      return 'Payment Completed';
    }
    if (this.remainingSchoolFees() <= 50000 && this.schoolFeePaymentCount() >= 2) {
      return 'Final Balance';
    }
    if (this.schoolFeePaymentCount() > 0) {
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
      && this.schoolFeePaymentCount() < this.maxInstallments()
      && this.remainingSchoolFees() > 0
  );

  readonly hasInternalPayment = computed(() => {
    if (this.schoolFeePaymentCount() > 0) {
      return true;
    }
    if (this.paidSchoolFees() > 0) {
      return true;
    }
    return this.studentSchoolFeeStatus()?.payment_status.total_due === 0;
  });

  readonly canAccessProfileVerification = computed(() => this.hasInternalPayment());

  readonly isAdmissionDocumentsVerified = computed(() => !!this.studentProfile()?.admission_document_verified);

  readonly isAllDocumentsVerified = computed(() => {
    const data = this.registrantData();
    const oLevelFile = data?.o_level_result?.[0]?.file?.file_name || '';
    const utmeFile = data?.utme_result?.file?.file_name || '';
    const birthFile = data?.certificate_of_birth?.file_name || '';
    return !!(oLevelFile && utmeFile && birthFile);
  });

  readonly coreDocuments = computed<VerificationDocument[]>(() => {
    const data = this.registrantData();
    const oLevelFile = data?.o_level_result?.[0]?.file?.file_name || '';
    const oLevelUrl = data?.o_level_result?.[0]?.file?.file_url || '';
    const utmeFile = data?.utme_result?.file?.file_name || '';
    const utmeUrl = data?.utme_result?.file?.file_url || '';
    const birthFile = data?.certificate_of_birth?.file_name || '';
    const birthUrl = data?.certificate_of_birth?.file_url || '';

    return [
      { label: 'O Level Result', fileName: oLevelFile, fileUrl: oLevelUrl, uploaded: !!oLevelFile },
      { label: 'Certificate of Birth', fileName: birthFile, fileUrl: birthUrl, uploaded: !!birthFile },
      { label: 'UTME Result', fileName: utmeFile, fileUrl: utmeUrl, uploaded: !!utmeFile }
    ];
  });

  readonly recommendationLetters = computed<VerificationDocument[]>(() => {
    const student = this.studentProfile();
    const admissionDocuments = student?.admission_documents;
    const data = this.registrantData();
    const rec1Removed = this.isAdmissionDocumentRemoved('recommendation_letter_1');
    const rec2Removed = this.isAdmissionDocumentRemoved('recommendation_letter_2');
    const recFile1 = this.uploadedRecommendationLetter1()?.file_name
      || (rec1Removed ? '' : admissionDocuments?.recommendation_letter_1?.file_name)
      || data?.academic_history?.[0]?.certificate?.file_name
      || '';
    const recUrl1 = this.uploadedRecommendationLetter1()?.file_url
      || (rec1Removed ? '' : admissionDocuments?.recommendation_letter_1?.file_url)
      || data?.academic_history?.[0]?.certificate?.file_url
      || '';
    const recFile2 = this.uploadedRecommendationLetter2()?.file_name
      || (rec2Removed ? '' : admissionDocuments?.recommendation_letter_2?.file_name)
      || data?.academic_history?.[1]?.certificate?.file_name
      || '';
    const recUrl2 = this.uploadedRecommendationLetter2()?.file_url
      || (rec2Removed ? '' : admissionDocuments?.recommendation_letter_2?.file_url)
      || data?.academic_history?.[1]?.certificate?.file_url
      || '';

    return [
      { label: 'Letter of Recommendation 1', fileName: recFile1, fileUrl: recUrl1, uploaded: !!recFile1 },
      { label: 'Letter of Recommendation 2', fileName: recFile2, fileUrl: recUrl2, uploaded: !!recFile2 }
    ];
  });

  readonly testimonialDocument = computed<VerificationDocument>(() => {
    const student = this.studentProfile();
    const admissionDocuments = student?.admission_documents;
    const data = this.registrantData();
    const testimonialRemoved = this.isAdmissionDocumentRemoved('testimonial');
    const testimonialFile = this.uploadedTestimonial()?.file_name
      || (testimonialRemoved ? '' : admissionDocuments?.testimonial?.file_name)
      || data?.certificate_of_origin?.file_name
      || '';
    const testimonialUrl = this.uploadedTestimonial()?.file_url
      || (testimonialRemoved ? '' : admissionDocuments?.testimonial?.file_url)
      || data?.certificate_of_origin?.file_url
      || '';

    return { label: 'Secondary School Testimonial', fileName: testimonialFile, fileUrl: testimonialUrl, uploaded: !!testimonialFile };
  });

  readonly canSubmitProfileDocuments = computed(() =>
    this.recommendationLetters().every((document) => document.uploaded)
    && this.testimonialDocument().uploaded
  );

  readonly canShowSubmitProfileDocumentsButton = computed(() => !this.isAdmissionDocumentsVerified());

  async uploadDocument(file: File, documentType: 'recommendation_letter_1' | 'recommendation_letter_2' | 'testimonial'): Promise<void> {
    if (this.isAdmissionDocumentsVerified()) {
      return;
    }
    this.uploadingDocument.set(documentType);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await firstValueFrom(this.appService.uploadFile(formData));
      switch (documentType) {
        case 'recommendation_letter_1':
          this.uploadedRecommendationLetter1.set(response);
          break;
        case 'recommendation_letter_2':
          this.uploadedRecommendationLetter2.set(response);
          break;
        case 'testimonial':
          this.uploadedTestimonial.set(response);
          break;
      }
      this.clearRemovedAdmissionDocument(documentType);
    } finally {
      this.uploadingDocument.set(null);
    }
  }

  async submitProfileDocuments(): Promise<void> {
    if (this.isAdmissionDocumentsVerified()) {
      return;
    }
    if (!this.canSubmitProfileDocuments()) {
      return;
    }
    this.submittingProfileDocuments.set(true);
    try {
      const data = this.registrantData();
      const student = this.studentProfile();
      const admissionDocuments = student?.admission_documents;
      const payload = {
        documents: {
          recommendation_letter_1: this.resolveAdmissionDocumentPayload(
            'recommendation_letter_1',
            this.uploadedRecommendationLetter1(),
            admissionDocuments?.recommendation_letter_1 || data?.academic_history?.[0]?.certificate
          ),
          recommendation_letter_2: this.resolveAdmissionDocumentPayload(
            'recommendation_letter_2',
            this.uploadedRecommendationLetter2(),
            admissionDocuments?.recommendation_letter_2 || data?.academic_history?.[1]?.certificate
          ),
          testimonial: this.resolveAdmissionDocumentPayload(
            'testimonial',
            this.uploadedTestimonial(),
            admissionDocuments?.testimonial || data?.certificate_of_origin
          )
        }
      };
      await firstValueFrom(this.appService.submitProfileDocuments(payload));
      await this.loadSnapshot();
    } finally {
      this.submittingProfileDocuments.set(false);
    }
  }

  removeAdmissionDocument(documentType: AdmissionDocumentType): void {
    if (this.isAdmissionDocumentsVerified()) {
      return;
    }
    const nextRemoved = Array.from(new Set([...this.removedAdmissionDocuments(), documentType]));
    this.removedAdmissionDocuments.set(nextRemoved);
    switch (documentType) {
      case 'recommendation_letter_1':
        this.uploadedRecommendationLetter1.set(null);
        break;
      case 'recommendation_letter_2':
        this.uploadedRecommendationLetter2.set(null);
        break;
      case 'testimonial':
        this.uploadedTestimonial.set(null);
        break;
    }
  }

  private isAdmissionDocumentRemoved(documentType: AdmissionDocumentType): boolean {
    return this.removedAdmissionDocuments().includes(documentType);
  }

  private clearRemovedAdmissionDocument(documentType: AdmissionDocumentType): void {
    const current = this.removedAdmissionDocuments();
    if (!current.includes(documentType)) {
      return;
    }
    this.removedAdmissionDocuments.set(current.filter((value) => value !== documentType));
  }

  private resolveAdmissionDocumentPayload(documentType: AdmissionDocumentType, uploaded: any, fallback: any): any {
    if (uploaded) {
      return uploaded;
    }
    if (this.isAdmissionDocumentRemoved(documentType)) {
      return {};
    }
    return fallback || {};
  }

  readonly selectedCourses = computed(() => {
    const selectedIds = this.selectedCourseIds();
    return this.availableCourses().filter((course) => selectedIds.includes(course.id));
  });

  readonly selectedUnits = computed(() => {
    return this.selectedCourses().reduce((sum, course) => sum + course.units, 0);
  });

  readonly selectedCount = computed(() => this.selectedCourses().length);

  readonly firstSemesterCourses = computed(() => {
    return this.availableCourses();
  });

  readonly secondSemesterCourses = computed(() => {
    return [];
  });

  readonly firstSemesterSelected = computed(() => {
    return this.selectedCourses();
  });

  readonly secondSemesterSelected = computed(() => {
    return [];
  });

  async loadSnapshot(): Promise<void> {
    const appNo = this.authSessionStore.applicationNo() || '';
    const hasStudentSnapshot = !!this.authSessionStore.studentProfile();
    if (!appNo && !hasStudentSnapshot) {
      this.registrantData.set(null);
      return;
    }

    this.loadingSnapshot.set(true);
    try {
      await this.loadStudentSnapshotAfterFirstInstallment();
      if (!this.authSessionStore.studentProfile() && appNo) {
        await this.loadApplicantSnapshot(appNo);
      }
      await this.loadStudentFeePlan();
      await this.loadCourses();
      await this.loadRegisteredCourses();
    } finally {
      this.loadingSnapshot.set(false);
    }
  }

  async loadCourses(): Promise<void> {
    this.loadingCourses.set(true);
    try {
      const response = await firstValueFrom(this.appService.getAvailableCourses());
      this.availableCourses.set(response.data);
    } finally {
      this.loadingCourses.set(false);
    }
  }

  async loadRegisteredCourses(): Promise<void> {
    try {
      const response = await firstValueFrom(this.appService.getCurrentCourses());
      const registeredCourses = flattenRegisteredCoursesResponse(response);
      this.registeredCourses.set(registeredCourses);
      this.registrationSubmitted.set(registeredCourses.length > 0);
    } catch (e) {
      // Ignore if not logged in or not allowed to fetch yet
      this.registeredCourses.set([]);
      this.registrationSubmitted.set(false);
    }
  }

  toggleCourseSelection(courseId: number, checked: boolean): void {
    const current = this.selectedCourseIds();
    if (checked) {
      if (!current.includes(courseId)) {
        this.selectedCourseIds.set([...current, courseId]);
      }
    } else {
      this.selectedCourseIds.set(current.filter(id => id !== courseId));
    }
  }

  async submitCourseRegistration(): Promise<void> {
    const payload = { course_ids: this.selectedCourseIds() };
    await firstValueFrom(this.appService.registerCourses(payload));
    this.registrationSubmitted.set(true);
  }

  async loadStudentFeePlan(): Promise<void> {
    this.loadingStudentFeePlan.set(true);
    try {
      const response = await firstValueFrom(this.appService.getStudentSchoolFeeStatus());
      this.studentSchoolFeeStatus.set(response);
      this.studentFeePlan.set(response);
    } catch {
      const response = await firstValueFrom(this.appService.getStudentFeePlans());
      const departmentId = this.registrantData()?.department?.id ?? null;
      const selectedPlan = selectMatchingStudentFeePlan(response.data, departmentId, null);
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
    const paymentCount = this.schoolFeePaymentCount();
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
    this.updateStudentSchoolFeeStatus(trimmedAmount);
    this.authSessionStore.setPaymentRef(resolvedReference);
    this.authSessionStore.setPaymentStatus('paid');
    void this.loadStudentSnapshotAfterFirstInstallment();

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
    const nextInstallmentNumber = this.schoolFeePaymentCount() + 1;
    const configuredAmount = readStudentFeeInstallmentAmount(this.studentFeePlan(), nextInstallmentNumber);
    const remaining = this.remainingSchoolFees();
    if (configuredAmount !== null) {
      return Math.min(configuredAmount, remaining);
    }

    if (remaining <= 0) {
      return 0;
    }
    if (this.schoolFeePaymentCount() === 0) {
      return Math.min(this.minFirstInstallment(), remaining);
    }
    return remaining;
  }

  private updateStudentSchoolFeeStatus(amount: number): void {
    const currentStatus = this.studentSchoolFeeStatus();
    if (!currentStatus) {
      return;
    }

    this.studentSchoolFeeStatus.set({
      ...currentStatus,
      payment_status: {
        total_paid: currentStatus.payment_status.total_paid + amount,
        total_due: Math.max(0, currentStatus.payment_status.total_due - amount),
        number_of_payments: currentStatus.payment_status.number_of_payments + 1
      }
    });
  }

  private async loadApplicantSnapshot(appNo: string): Promise<void> {
    const response = await firstValueFrom(this.appService.registrantData(appNo));
    this.applyRegistrantSnapshot(response?.data ?? null);
  }

  private async loadStudentSnapshotAfterFirstInstallment(): Promise<void> {
    if (!this.shouldLoadStudentSnapshot()) {
      return;
    }
    if (this.authSessionStore.studentProfile()) {
      return;
    }
    try {
      const response = await firstValueFrom(this.appService.studentData());
      const profile: StudentSingleData | null = response?.data ?? null;
      if (profile?.matriculation_number) {
        this.authSessionStore.setStudentProfile(profile);
      }
    } catch {
      // Keep the applicant snapshot when the student profile is not ready yet.
    }
  }

  private applyRegistrantSnapshot(data: RegistrantData | null): void {
    this.registrantData.set(data);
    this.authSessionStore.syncRegistrantSession(data);
  }

  private shouldLoadStudentSnapshot(): boolean {
    const userType = (this.authSessionStore.userType() || '').toLowerCase().trim();
    if (userType.includes('student')) {
      return true;
    }
    if (!!this.authSessionStore.matriculationNo()) {
      return true;
    }
    if (this.isSchoolFeesFullyPaid()) {
      return true;
    }
    return this.hasInternalPayment();
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
