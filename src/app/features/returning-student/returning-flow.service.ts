import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StudentFeePlan, StudentSchoolFeeStatus } from '../../data/application/student-fees.dto';
import { ApplicationService } from '../../services/application.service';
import { AuthSessionStore } from '../../store/auth-session.store';
import {
  readStudentFeeInstallmentAmount,
  readStudentFeeInstallmentNumbers,
} from '../../utility/student-fees-plan';
import { AvailableCourse, RegisteredCourse } from '../../data/application/courseregistration.dto';

export type ReturningCourse = {
  code: string;
  title: string;
  units: number;
  category: 'carryover' | 'level';
  locked?: boolean;
  selectedByDefault?: boolean;
};

export type ReturningPaymentRecord = {
  installmentLabel: string;
  amount: number;
  paidAt: Date;
  referenceNo: string;
};

export type SchoolFeeInstallment = {
  installmentLabel: string;
  amount: number;
  referenceNo: string;
  paidAt: Date;
};

export type CourseReviewState = 'locked' | 'waiting' | 'rejected' | 'open';

export type ResitCourse = {
  code: string;
  title: string;
  units: number;
  score: number;
  registered?: boolean;
  test: number;
  exam: number;
  total: number;
  countdown: { days: number; hours: number; mins: number; secs: number };
  examDate: string;
  examTime: string;
  duration: string;
  venue: string;
  fee: number;
};

export type SemesterResultRow = {
  code: string;
  title: string;
  units: number;
  ca: number;
  exam: number;
  total: number;
  grade: string;
};

export type CgpaThreshold = {
  scoreRange: string;
  letterGrade: string;
  gradePoint: string;
  cgpaRange?: string;
  classOfDegree: string;
  highlighted?: boolean;
};

export type FeeItem = {
  id: string;
  name: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'remaining';
  type: 'mandatory' | 'optional';
};

export type HostelApplicationStatus = 'locked' | 'form' | 'pending' | 'allocated';

export type HostelApplicationPayload = {
  academicSession: string;
  preferredHostel: string;
  preferredBlock: string;
  specialNeeds: string;
  acknowledged: boolean;
};

export type HostelAllocation = {
  hostelName: string;
  block: string;
  roomNumber: string;
  floor: string;
  roomType: string;
  bed: string;
};

export type ReturningProfileTab = 'overview' | 'personal' | 'account';

export type ProfileOverviewData = {
  fullName: string;
  matricNo: string;
  level: string;
  admissionYear: string;
  status: string;
};

export type PersonalContactData = {
  fullName: string;
  email: string;
  phone: string;
  alternatePhone: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  stateOfOrigin: string;
  lgaOfOrigin: string;
  disability: string;
  specificDisability: string;
};

export type AddressData = {
  houseNumber: string;
  streetName: string;
  landmark: string;
  areaTown: string;
  state: string;
  lga: string;
};

export type NextOfKinData = {
  fullName: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  title: string;
  relationship: string;
  occupation: string;
  phone: string;
  alternatePhone: string;
};

@Injectable({ providedIn: 'root' })
export class ReturningFlowService {
  private readonly appService = inject(ApplicationService);

  private readonly authSessionStore = inject(AuthSessionStore);

  readonly studentName = signal('ISHOLA, Hassan Gbadebo');

  readonly matricNo = signal('CONSMMEFS/NUR/2024/0142');

  readonly program = signal('Nursing Science');

  readonly session = signal('2025/2026');

  readonly level = signal('OND 2');

  readonly semester = signal('1st Semester');

  readonly selectedResultSemester = signal('OND 1 First Semester');

  readonly activeProfileTab = signal<ReturningProfileTab>('overview');

  readonly hostelApplicationStatus = signal<HostelApplicationStatus>('locked');

  readonly hostelApplicationDraft = signal<HostelApplicationPayload>({
    academicSession: '',
    preferredHostel: '',
    preferredBlock: '',
    specialNeeds: '',
    acknowledged: false
  });

  readonly hostelApplicationDate = signal<Date | null>(null);

  readonly hostelAllocation = signal<HostelAllocation>({
    hostelName: 'Abimbola Hostel',
    block: 'Block A',
    roomNumber: 'Room 17',
    floor: '2nd Floor',
    roomType: '4-bed shared',
    bed: 'Bed 3'
  });

  readonly cumulativeGpa = signal(3.78);

  readonly gpaClass = signal('Second Class Upper');

  readonly gpaDelta = signal('from 3.68');

  readonly currentCgpa = signal(3.67);

  readonly bestSemesterGpa = signal(3.78);

  readonly lowestSemesterGpa = signal(3.56);

  readonly semestersCompleted = signal(2);

  readonly semestersTotal = signal(4);

  readonly totalSchoolFees = 600000;

  readonly minimumFirstPayment = 500000;

  readonly maxInstallments = 3;

  readonly paymentHistory = signal<ReturningPaymentRecord[]>([]);

  readonly schoolFeeInstallments = signal<SchoolFeeInstallment[]>([]);

  readonly loadingStudentFeePlan = signal(false);

  readonly loadingCourses = signal(false);

  readonly studentFeePlan = signal<StudentFeePlan | null>(null);

  readonly studentSchoolFeeStatus = signal<StudentSchoolFeeStatus | null>(null);

  readonly availableCourses = signal<AvailableCourse[]>([]);

  readonly selectedCourseIds = signal<number[]>([]);

  readonly selectedCoursesFromApi = computed(() =>
    this.availableCourses().filter(course => this.selectedCourseIds().includes(course.id))
  );

  readonly totalUnitsSelectedFromApi = computed(() =>
    this.selectedCoursesFromApi().reduce((sum, course) => sum + course.units, 0)
  );

  readonly totalCoursesSelectedFromApi = computed(() =>
    this.selectedCoursesFromApi().length
  );

  readonly registeredCourses = signal<RegisteredCourse[]>([]);

  readonly hasRegisteredCourses = computed(() => this.registeredCourses().length > 0);

  readonly firstSemesterRegistered = computed(() => {
    return this.registeredCourses().filter(c => c.semester.toLowerCase().includes('first'));
  });

  readonly secondSemesterRegistered = computed(() => {
    return this.registeredCourses().filter(c => c.semester.toLowerCase().includes('second'));
  });

  readonly totalRegisteredUnits = computed(() => 
    this.registeredCourses().reduce((sum, course) => sum + course.units, 0)
  );

  readonly totalRegisteredCount = computed(() => this.registeredCourses().length);

  readonly configuredTotalSchoolFees = computed(() =>
    this.studentSchoolFeeStatus()?.amount ?? this.studentFeePlan()?.amount ?? this.totalSchoolFees
  );

  readonly configuredMaxInstallments = computed(() => {
    const configuredInstallments = readStudentFeeInstallmentNumbers(this.studentFeePlan());
    return configuredInstallments.length || this.maxInstallments;
  });

  readonly configuredMinimumFirstPayment = computed(() =>
    readStudentFeeInstallmentAmount(this.studentFeePlan(), 1) ?? this.minimumFirstPayment
  );

  readonly schoolFeePaymentCount = computed(() =>
    this.studentSchoolFeeStatus()?.payment_status.number_of_payments ?? this.schoolFeeInstallments().length
  );

  readonly hasPaidFirstSchoolFeeInstallment = computed(() =>
    this.schoolFeePaymentCount() > 0 || this.schoolFeesPaid() > 0
  );

  readonly canAccessCoursesModule = computed(() => this.hasPaidFirstSchoolFeeInstallment());

  readonly canAccessProfileModule = computed(() => this.hasPaidFirstSchoolFeeInstallment());

  readonly canAccessHostelModule = computed(() => this.hasPaidFirstSchoolFeeInstallment());

  readonly fees = signal<FeeItem[]>([
    { id: 'school-fees', name: 'School Fees', amount: 600000, status: 'remaining', type: 'mandatory' },
    { id: 'faculty-charges', name: 'Faculty Charges', amount: 10000, status: 'paid', type: 'mandatory' },
    { id: 'departmental-fees', name: 'Departmental Fees', amount: 5000, status: 'unpaid', type: 'mandatory' },
    { id: 'medical-fees', name: 'Medical Fees', amount: 8000, status: 'paid', type: 'mandatory' },
    { id: 'student-union-levy', name: 'Student Union Levy', amount: 2000, status: 'paid', type: 'mandatory' },
    { id: 'late-registration', name: 'Late Registration', amount: 600000, status: 'unpaid', type: 'optional' },
    { id: 'hostel', name: 'Hostel', amount: 10000, status: 'unpaid', type: 'optional' },
    { id: 'exam-resit', name: 'Exam Resit', amount: 5000, status: 'unpaid', type: 'optional' }
  ]);

  readonly announcementFeed = signal([
    {
      title: 'Course registration now open - 200 Level',
      body: 'All 200-level students are invited to register for 1st semester courses. Registration closes 14 December. Students with outstanding fees must pay before access.',
      timeAgo: '5h ago'
    },
    {
      title: 'Course registration now open - 200 Level',
      body: 'All 200-level students are invited to register for 1st semester courses. Registration closes 14 December. Students with outstanding fees must pay before access.',
      timeAgo: '5h ago'
    }
  ]);

  readonly courseReviewState = signal<CourseReviewState>('locked');

  readonly coursePool = signal<ReturningCourse[]>([
    { code: 'NUR 101', title: 'Introduction to Nursing', units: 3, category: 'carryover', selectedByDefault: true },
    { code: 'NUR 111', title: 'Nursing Practices in Nigeria', units: 2, category: 'carryover', selectedByDefault: true },
    { code: 'NUR 211', title: 'Human Anatomy III', units: 3, category: 'level', selectedByDefault: true },
    { code: 'NUR 212', title: 'Human Anatomy III', units: 3, category: 'level', selectedByDefault: true },
    { code: 'NUR 213', title: 'Human Anatomy III', units: 3, category: 'level' },
    { code: 'NUR 214', title: 'Human Anatomy III', units: 3, category: 'level' },
    { code: 'NUR 215', title: 'Human Anatomy III', units: 3, category: 'level' },
    { code: 'NUR 216', title: 'Human Anatomy III', units: 3, category: 'level' },
    { code: 'NUR 217', title: 'Human Anatomy III', units: 3, category: 'level', locked: true },
    { code: 'NUR 218', title: 'Human Anatomy III', units: 3, category: 'level' },
    { code: 'NUR 219', title: 'Human Anatomy III', units: 3, category: 'level' }
  ]);

  readonly resitCourses = signal<ResitCourse[]>([
    {
      code: 'NUR 111',
      title: 'Human Anatomy I',
      units: 3,
      score: 36,
      registered: true,
      test: 13,
      exam: 23,
      total: 36,
      countdown: { days: 9, hours: 13, mins: 16, secs: 10 },
      examDate: '20 May 2026',
      examTime: '9:00 AM',
      duration: '3 hours',
      venue: 'Hall 6, Block F',
      fee: 5000
    },
    {
      code: 'NUR 113',
      title: 'Human Anatomy I',
      units: 3,
      score: 36,
      test: 13,
      exam: 23,
      total: 36,
      countdown: { days: 9, hours: 13, mins: 16, secs: 10 },
      examDate: '20 May 2026',
      examTime: '9:00 AM',
      duration: '3 hours',
      venue: 'Hall 6, Block F',
      fee: 5000
    }
  ]);

  readonly semesterResultRows = signal<SemesterResultRow[]>([
    { code: 'NUR 211', title: 'Human Anatomy III', units: 3, ca: 20, exam: 55, total: 75, grade: 'A' },
    { code: 'NUR 212', title: 'Human Anatomy III', units: 3, ca: 20, exam: 55, total: 75, grade: 'A' },
    { code: 'NUR 213', title: 'Human Anatomy III', units: 3, ca: 20, exam: 15, total: 35, grade: 'F' },
    { code: 'NUR 214', title: 'Human Anatomy III', units: 3, ca: 20, exam: 55, total: 75, grade: 'A' },
    { code: 'NUR 215', title: 'Human Anatomy III', units: 3, ca: 20, exam: 55, total: 75, grade: 'A' },
    { code: 'NUR 216', title: 'Human Anatomy III', units: 3, ca: 20, exam: 55, total: 75, grade: 'A' },
    { code: 'NUR 217', title: 'Human Anatomy III', units: 3, ca: 20, exam: 55, total: 75, grade: 'A' },
    { code: 'NUR 218', title: 'Human Anatomy III', units: 3, ca: 20, exam: 55, total: 75, grade: 'A' }
  ]);

  readonly resultSemesterOptions = signal(['OND 1 First Semester', 'HND 1 First Semester', 'OND 2 First Semester']);

  readonly hostelSessionOptions = signal(['2025/2026']);

  readonly hostelOptions = signal(['Abimbola Hostel', 'Amina Hostel', 'Legacy Hostel']);

  readonly hostelBlockOptions = signal(['Block A', 'Block B', 'Block C']);

  readonly cgpaThresholds = signal<CgpaThreshold[]>([
    { scoreRange: '70 - 100', letterGrade: 'A', gradePoint: '5', cgpaRange: '4.50 - 5.00', classOfDegree: 'First Class' },
    { scoreRange: '60 - 69', letterGrade: 'B', gradePoint: '4', cgpaRange: '3.50 - 4.49', classOfDegree: 'Second Class Upper', highlighted: true },
    { scoreRange: '50 - 59', letterGrade: 'C', gradePoint: '3', cgpaRange: '2.40 - 3.49', classOfDegree: 'Second Class Lower' },
    { scoreRange: '45 - 49', letterGrade: 'D', gradePoint: '2', cgpaRange: '1.50 - 2.39', classOfDegree: 'Third Class' },
    { scoreRange: '40 - 44', letterGrade: 'E', gradePoint: '1', cgpaRange: '1.00 - 1.49', classOfDegree: 'Pass' },
    { scoreRange: '0 - 39', letterGrade: 'F', gradePoint: '0', cgpaRange: '0.00 - 0.99', classOfDegree: 'Fail' }
  ]);

  readonly semesterGpaPoints = signal([
    { label: '1st Semester\nOND 1', value: 3.78, active: true },
    { label: '2nd Semester\nOND 1', value: 3.56, active: true },
    { label: '1st Semester\nOND 2', value: null, active: false },
    { label: '2nd Semester\nOND 2', value: null, active: false }
  ]);

  readonly selectedCourseCodes = signal<string[]>(
    this.coursePool()
      .filter((course) => course.selectedByDefault)
      .map((course) => course.code)
  );

  readonly paidAmount = computed(() =>
    this.paymentHistory().reduce((sum, entry) => sum + entry.amount, 0)
  );

  readonly outstandingAmount = computed(() => Math.max(0, this.totalSchoolFees - this.paidAmount()));

  readonly outstandingInstallmentLabel = computed(() => {
    const installmentNo = this.paymentHistory().length + 1;
    return `${installmentNo}${this.ordinalSuffix(installmentNo)} Installment`;
  });

  readonly hasInternalPayment = computed(() => this.hasPaidFirstSchoolFeeInstallment());

  readonly paymentProgressPercent = computed(() =>
    Math.max(0, Math.min(100, Math.round((this.paidAmount() / this.totalSchoolFees) * 100)))
  );

  readonly selectedCourses = computed(() =>
    this.coursePool().filter((course) => this.selectedCourseCodes().includes(course.code))
  );

  readonly totalUnitsSelected = computed(() =>
    this.selectedCourses().reduce((sum, course) => sum + course.units, 0)
  );

  readonly totalCoursesSelected = computed(() => this.selectedCourses().length);

  readonly carryoverCourses = computed(() =>
    this.coursePool().filter((course) => course.category === 'carryover')
  );

  readonly levelCourses = computed(() =>
    this.coursePool().filter((course) => course.category === 'level')
  );

  readonly hasFailedCourse = computed(() => this.carryoverCourses().length > 0);

  readonly schoolFeesPaid = computed(() =>
    this.studentSchoolFeeStatus()?.payment_status.total_paid
    ?? this.schoolFeeInstallments().reduce((sum, item) => sum + item.amount, 0)
  );

  readonly schoolFeesRemaining = computed(() =>
    this.studentSchoolFeeStatus()?.payment_status.total_due
    ?? Math.max(0, this.configuredTotalSchoolFees() - this.schoolFeesPaid())
  );

  readonly schoolFeesProgressPercent = computed(() =>
    Math.max(0, Math.min(100, Math.round((this.schoolFeesPaid() / this.configuredTotalSchoolFees()) * 100)))
  );

  readonly canAddSchoolFeeInstallment = computed(() =>
    this.resolveNextSchoolFeeAmount() > 0
    && this.schoolFeePaymentCount() < this.configuredMaxInstallments()
    && this.schoolFeesRemaining() > 0
  );

  readonly mandatoryFees = computed(() => this.fees().filter((fee) => fee.type === 'mandatory'));

  readonly optionalFees = computed(() => this.fees().filter((fee) => fee.type === 'optional'));

  readonly hostelFeeStatus = computed(() => this.fees().find((fee) => fee.id === 'hostel')?.status ?? 'unpaid');

  readonly canAccessHostelApplication = computed(() => this.hostelFeeStatus() === 'paid');

  readonly effectiveHostelStatus = computed<HostelApplicationStatus>(() => {
    if (!this.canAccessHostelApplication()) {
      return 'locked';
    }
    const current = this.hostelApplicationStatus();
    return current === 'locked' ? 'form' : current;
  });

  readonly semesterResultGpa = computed(() => 3.85);

  readonly profileOverview = signal<ProfileOverviewData>({
    fullName: 'ISHOLA, Hassan Gbadebo',
    matricNo: 'CONSMMEFS/NUR/2024/0142',
    level: 'OND 2',
    admissionYear: '2024/25',
    status: 'Active'
  });

  readonly personalContact = signal<PersonalContactData>({
    fullName: 'ISHOLA, Hassan Gbadebo',
    email: 'igbadeobh@gmail.com',
    phone: '0802 773 6450',
    alternatePhone: '0702 308 4619',
    dateOfBirth: '14 March 2004',
    gender: 'Male',
    maritalStatus: 'Single',
    nationality: 'Nigerian',
    stateOfOrigin: 'Oyo State',
    lgaOfOrigin: 'Oyo North',
    disability: 'No',
    specificDisability: 'None'
  });

  readonly residentialAddress = signal<AddressData>({
    houseNumber: '3',
    streetName: 'Akin Bayo close',
    landmark: 'Grey Hotel',
    areaTown: 'Akinyele',
    state: 'Oyo State',
    lga: 'Akinyele'
  });

  readonly nextOfKin = signal<NextOfKinData>({
    fullName: 'ISHOLA, Dada Haruna',
    email: 'ihadola@gmail.com',
    firstName: 'Dada',
    middleName: 'Haruna',
    lastName: 'Ishola',
    title: 'Chief',
    relationship: 'Father',
    occupation: 'Trader',
    phone: '0707 289 0246',
    alternatePhone: '0702 308 4619'
  });

  readonly nextOfKinResidence = signal<AddressData>({
    houseNumber: '3',
    streetName: 'Akin Bayo close',
    landmark: 'Grey Hotel',
    areaTown: 'Akinyele',
    state: 'Oyo State',
    lga: 'Akinyele'
  });

  toggleCourseSelection(course: ReturningCourse, checked: boolean): void {
    if (course.locked || course.category === 'carryover') {
      return;
    }
    const current = this.selectedCourseCodes();
    if (checked && !current.includes(course.code)) {
      this.selectedCourseCodes.set([...current, course.code]);
      return;
    }
    if (!checked && current.includes(course.code)) {
      this.selectedCourseCodes.set(current.filter((code) => code !== course.code));
    }
  }

  isSelected(code: string): boolean {
    return this.selectedCourseCodes().includes(code);
  }

  addDummyPayment(amount: number): { ok: boolean; message: string } {
    const normalizedAmount = Math.floor(amount || 0);
    if (normalizedAmount <= 0) {
      return { ok: false, message: 'Enter a valid payment amount.' };
    }
    if (!this.hasInternalPayment() && normalizedAmount < this.minimumFirstPayment) {
      return { ok: false, message: `Minimum first payment is ${this.formatCurrency(this.minimumFirstPayment)}.` };
    }
    if (normalizedAmount > this.outstandingAmount()) {
      return { ok: false, message: `Amount cannot exceed ${this.formatCurrency(this.outstandingAmount())}.` };
    }
    if (this.paymentHistory().length >= this.maxInstallments) {
      return { ok: false, message: 'Maximum installment count reached.' };
    }

    const installmentNo = this.paymentHistory().length + 1;
    const paidAt = new Date();
    const entry: ReturningPaymentRecord = {
      installmentLabel: `${installmentNo}${this.ordinalSuffix(installmentNo)} Installment`,
      amount: normalizedAmount,
      paidAt,
      referenceNo: `RET-${paidAt.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
    };
    this.paymentHistory.set([...this.paymentHistory(), entry]);
    this.markFeeAsPaidByPriority();

    if (this.courseReviewState() === 'locked') {
      this.courseReviewState.set('waiting');
    }
    return { ok: true, message: 'Payment recorded successfully.' };
  }

  payFee(feeId: string): { ok: boolean; message: string } {
    const target = this.fees().find((fee) => fee.id === feeId);
    if (!target) {
      return { ok: false, message: 'Fee item not found.' };
    }
    if (target.status === 'paid') {
      return { ok: false, message: 'Fee has already been paid.' };
    }
    const result = this.addDummyPayment(target.amount);
    if (!result.ok) {
      return result;
    }
    const updated = this.fees().map((fee) =>
      fee.id === feeId ? { ...fee, status: 'paid' as const } : fee
    );
    this.fees.set(updated);
    if (feeId === 'hostel' && this.hostelApplicationStatus() === 'locked') {
      this.hostelApplicationStatus.set('form');
    }
    return { ok: true, message: `${target.name} payment recorded.` };
  }

  setResultSemester(value: string): void {
    this.selectedResultSemester.set(value);
  }

  setProfileTab(tab: ReturningProfileTab): void {
    this.activeProfileTab.set(tab);
  }

  updatePersonalContact(patch: Partial<PersonalContactData>): void {
    this.personalContact.set({ ...this.personalContact(), ...patch });
  }

  updateResidentialAddress(patch: Partial<AddressData>): void {
    this.residentialAddress.set({ ...this.residentialAddress(), ...patch });
  }

  updateNextOfKin(patch: Partial<NextOfKinData>): void {
    this.nextOfKin.set({ ...this.nextOfKin(), ...patch });
  }

  updateNextOfKinResidence(patch: Partial<AddressData>): void {
    this.nextOfKinResidence.set({ ...this.nextOfKinResidence(), ...patch });
  }

  saveProfileChanges(): { ok: boolean; message: string } {
    return { ok: true, message: 'Profile changes saved successfully.' };
  }

  updateAccountPassword(currentPassword: string, newPassword: string, confirmPassword: string): { ok: boolean; message: string } {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return { ok: false, message: 'Please fill all password fields.' };
    }
    if (newPassword.length < 8) {
      return { ok: false, message: 'New password must be at least 8 characters.' };
    }
    if (newPassword !== confirmPassword) {
      return { ok: false, message: 'Confirm password does not match new password.' };
    }
    return { ok: true, message: 'Password updated successfully.' };
  }

  updateHostelDraft(patch: Partial<HostelApplicationPayload>): void {
    this.hostelApplicationDraft.set({ ...this.hostelApplicationDraft(), ...patch });
  }

  submitHostelApplication(payload: HostelApplicationPayload): { ok: boolean; message: string } {
    if (!this.canAccessHostelApplication()) {
      return { ok: false, message: 'Hostel application is locked until hostel fee is paid.' };
    }
    if (!payload.academicSession || !payload.preferredHostel || !payload.preferredBlock) {
      return { ok: false, message: 'Complete all required hostel fields.' };
    }
    if (!payload.acknowledged) {
      return { ok: false, message: 'You must acknowledge hostel rules before submission.' };
    }
    this.hostelApplicationDraft.set(payload);
    this.hostelApplicationDate.set(new Date());
    this.hostelApplicationStatus.set('pending');
    return { ok: true, message: 'Hostel application submitted successfully.' };
  }

  setHostelApplicationStatus(status: HostelApplicationStatus): void {
    if (!this.canAccessHostelApplication() && status !== 'locked') {
      this.hostelApplicationStatus.set('locked');
      return;
    }
    this.hostelApplicationStatus.set(status);
  }

  setCourseReviewState(state: CourseReviewState): void {
    if (state !== 'locked' && !this.hasInternalPayment()) {
      this.courseReviewState.set('locked');
      return;
    }
    this.courseReviewState.set(state);
  }

  submitCourseRegistration(): void {
    this.courseReviewState.set('waiting');
  }

  async loadStudentFeePlan(): Promise<void> {
    this.loadingStudentFeePlan.set(true);
    try {
      const response = await firstValueFrom(this.appService.getStudentSchoolFeeStatus());
      this.studentSchoolFeeStatus.set(response);
      this.studentFeePlan.set(response);
      this.syncReturningModuleAccess();
    } catch {
      const response = await firstValueFrom(this.appService.getStudentFeePlans());
      this.studentFeePlan.set(response.data[0] ?? null);
      this.syncReturningModuleAccess();
    } finally {
      this.loadingStudentFeePlan.set(false);
    }
  }

  async loadAvailableCourses(): Promise<void> {
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
      this.registeredCourses.set(response.data);
    } catch (e) {
      this.registeredCourses.set([]);
    }
  }

  async submitCourseRegistrationFromApi(): Promise<void> {
    const payload = { course_ids: this.selectedCourseIds() };
    await firstValueFrom(this.appService.registerCourses(payload));
    await this.loadRegisteredCourses();
  }

  toggleCourseSelectionFromApi(courseId: number, checked: boolean): void {
    const current = this.selectedCourseIds();
    if (checked) {
      if (!current.includes(courseId)) {
        this.selectedCourseIds.set([...current, courseId]);
      }
    } else {
      this.selectedCourseIds.set(current.filter(id => id !== courseId));
    }
  }

  isCourseSelectedFromApi(courseId: number): boolean {
    return this.selectedCourseIds().includes(courseId);
  }

  suggestedAmount(): number {
    if (!this.hasInternalPayment()) {
      return Math.min(this.minimumFirstPayment, this.outstandingAmount());
    }
    return this.outstandingAmount();
  }

  suggestedSchoolFeeAmount(): number {
    return this.resolveNextSchoolFeeAmount();
  }

  recordVerifiedSchoolFeeInstallment(amount: number, reference?: string): { ok: boolean; message: string } {
    const normalizedAmount = Math.floor(amount);
    const paidCount = this.schoolFeePaymentCount();
    const remaining = this.schoolFeesRemaining();

    if (!this.canAddSchoolFeeInstallment()) {
      return { ok: false, message: 'No pending school fee installment at the moment.' };
    }
    if (normalizedAmount <= 0) {
      return { ok: false, message: 'Enter a valid amount.' };
    }
    if (paidCount === 0 && normalizedAmount < this.configuredMinimumFirstPayment()) {
      return { ok: false, message: `First payment minimum is ${this.formatCurrency(this.configuredMinimumFirstPayment())}.` };
    }
    if (normalizedAmount > remaining) {
      return { ok: false, message: `Amount cannot exceed ${this.formatCurrency(remaining)}.` };
    }

    const installmentNo = paidCount + 1;
    const isFinal = installmentNo >= this.configuredMaxInstallments() || normalizedAmount === remaining;
    const paidAt = new Date();
    const entry: SchoolFeeInstallment = {
      installmentLabel: isFinal
        ? `${installmentNo}${this.ordinalSuffix(installmentNo)} Installment (Final Payment)`
        : `${installmentNo}${this.ordinalSuffix(installmentNo)} Installment`,
      amount: normalizedAmount,
      paidAt,
      referenceNo: reference || this.authSessionStore.paymentRef() || `REM-${paidAt.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
    };

    this.schoolFeeInstallments.set([...this.schoolFeeInstallments(), entry]);
    this.paymentHistory.set([
      ...this.paymentHistory(),
      {
        installmentLabel: entry.installmentLabel,
        amount: entry.amount,
        paidAt: entry.paidAt,
        referenceNo: entry.referenceNo
      }
    ]);
    this.authSessionStore.setPaymentRef(entry.referenceNo);
    this.authSessionStore.setPaymentStatus('paid');
    this.updateStudentSchoolFeeStatus(normalizedAmount);
    this.syncReturningModuleAccess();
    if (this.courseReviewState() === 'locked') {
      this.courseReviewState.set('waiting');
    }
    this.markFeeAsPaidByPriority();
    return { ok: true, message: `${entry.installmentLabel} recorded successfully.` };
  }

  formatCurrency(value: number): string {
    return `₦${value.toLocaleString('en-NG')}`;
  }

  private resolveNextSchoolFeeAmount(): number {
    const nextInstallmentNumber = this.schoolFeePaymentCount() + 1;
    const configuredAmount = readStudentFeeInstallmentAmount(this.studentFeePlan(), nextInstallmentNumber);
    const remaining = this.schoolFeesRemaining();
    if (configuredAmount !== null) {
      return Math.min(configuredAmount, remaining);
    }

    if (remaining <= 0) {
      return 0;
    }
    if (this.schoolFeePaymentCount() === 0) {
      return Math.min(this.configuredMinimumFirstPayment(), this.schoolFeesRemaining());
    }
    return this.schoolFeesRemaining();
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

  private syncReturningModuleAccess(): void {
    if (this.hasPaidFirstSchoolFeeInstallment()) {
      if (this.courseReviewState() === 'locked') {
        this.courseReviewState.set('waiting');
      }
      if (!this.hasPaidStatus(this.authSessionStore.paymentStatus())) {
        this.authSessionStore.setPaymentStatus('paid');
      }
      return;
    }

    this.courseReviewState.set('locked');
  }

  private hasPaidStatus(status: string): boolean {
    const normalized = status.toLowerCase().trim();
    if (!normalized) {
      return false;
    }

    return normalized.includes('paid')
      || normalized.includes('complete')
      || normalized.includes('success');
  }

  private readCurrentLevelNumber(): number | null {
    const matchedLevel = this.level().match(/\d+/);
    if (!matchedLevel) {
      return null;
    }

    const parsedLevel = Number(matchedLevel[0]);
    return Number.isInteger(parsedLevel) && parsedLevel > 0 ? parsedLevel : null;
  }

  private markFeeAsPaidByPriority(): void {
    const target = this.fees().find((fee) => fee.status !== 'paid' && fee.type === 'mandatory')
      ?? this.fees().find((fee) => fee.status !== 'paid');
    if (!target) {
      return;
    }
    this.fees.set(
      this.fees().map((fee) =>
        fee.id === target.id ? { ...fee, status: 'paid' as const } : fee
      )
    );
  }

  private ordinalSuffix(n: number): string {
    if (n % 10 === 1 && n % 100 !== 11) return 'st';
    if (n % 10 === 2 && n % 100 !== 12) return 'nd';
    if (n % 10 === 3 && n % 100 !== 13) return 'rd';
    return 'th';
  }
}
