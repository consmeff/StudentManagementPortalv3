import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { StudentCgpaTrendResponse } from '../../data/application/student-cgpa-trend.dto';
import { StudentFeePlan, StudentSchoolFeeStatus } from '../../data/application/student-fees.dto';
import { StudentDashboardAnnouncement, StudentDashboardResponse } from '../../data/application/student-dashboard.dto';
import { StudentHostelAllocation, StudentHostelOption, StudentHostelRoomOption } from '../../data/application/student-hostel.dto';
import { StudentResultsResponse } from '../../data/application/student-results.dto';
import { ApplicationService } from '../../services/application.service';
import { AuthSessionStore } from '../../store/auth-session.store';
import {
  readStudentFeeInstallmentAmount,
  readStudentFeeInstallmentNumbers,
  selectStudentFeePlan,
} from '../../utility/student-fees-plan';
import { AvailableCourse, RegisteredCourse, flattenRegisteredCoursesResponse } from '../../data/application/courseregistration.dto';

export type ReturningCourse = {
  code: string;
  title: string;
  units: number;
  category: 'carryover' | 'level';
  locked?: boolean;
  selectedByDefault?: boolean;
};

export type ReturningPaymentRecord = {
  feeId: string;
  paymentType: string;
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
  units: number | null;
  ca: number;
  exam: number;
  total: number;
  grade: string | null;
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
  referenceId: string;
};

export type HostelApplicationStatus = 'request' | 'pending' | 'allocated';

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

export type ReturningAnnouncementFeedItem = {
  title: string;
  body: string;
  timeAgo: string;
};

export type SemesterGpaPoint = {
  label: string;
  value: number | null;
  active: boolean;
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

  readonly hostelApplicationStatus = signal<HostelApplicationStatus>('allocated');

  readonly hostelApplicationDraft = signal<HostelApplicationPayload>({
    academicSession: '2025/2026',
    preferredHostel: '',
    preferredBlock: '',
    specialNeeds: '',
    acknowledged: false
  });

  readonly hostelApplicationDate = signal<Date | null>(null);

  readonly hostelAllocation = signal<HostelAllocation>({
    hostelName: '',
    block: '',
    roomNumber: '',
    floor: '',
    roomType: '',
    bed: ''
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

  readonly loadingStudentDashboard = signal(false);

  readonly loadingStudentResults = signal(false);

  readonly loadingStudentCgpaTrend = signal(false);

  readonly loadingHostelAllocation = signal(false);

  readonly loadingHostelOptions = signal(false);

  readonly studentFeePlan = signal<StudentFeePlan | null>(null);

  readonly studentSchoolFeeStatus = signal<StudentSchoolFeeStatus | null>(null);

  readonly studentDashboard = signal<StudentDashboardResponse | null>(null);

  readonly hasLoadedStudentDashboard = signal(false);

  readonly studentResults = signal<StudentResultsResponse | null>(null);

  readonly studentCgpaTrend = signal<StudentCgpaTrendResponse | null>(null);

  readonly hasLoadedHostelAllocation = signal(false);

  readonly hasLoadedHostelOptions = signal(false);

  readonly availableHostels = signal<StudentHostelOption[]>([]);

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
    this.schoolFeePaymentCount() > 0
    || this.schoolFeesPaid() > 0
    || (this.studentDashboard()?.fee_info.total_paid ?? 0) > 0
    || (this.studentDashboard()?.fee_info.total_due ?? 0) <= 0
  );

  readonly canAccessCoursesModule = computed(() => this.hasPaidFirstSchoolFeeInstallment());

  readonly canAccessProfileModule = computed(() => this.hasPaidFirstSchoolFeeInstallment());

  readonly canAccessHostelModule = computed(() => this.hasPaidFirstSchoolFeeInstallment());

  readonly fees = signal<FeeItem[]>([]);

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

  readonly studentPhotoUrl = computed(() => this.authSessionStore.studentProfile()?.passport_photo?.file_url || 'assets/logo.png');

  readonly dashboardAnnouncementFeed = computed<ReturningAnnouncementFeedItem[]>(() => {
    if (!this.hasLoadedStudentDashboard()) {
      return this.announcementFeed();
    }
    return this.normalizeDashboardAnnouncements(this.studentDashboard()?.recent_announcements ?? []);
  });

  readonly dashboardOutstandingAmount = computed(() =>
    Math.max(0, this.studentDashboard()?.fee_info.total_due ?? this.outstandingAmount())
  );

  readonly dashboardTotalFeeBenchmark = computed(() => {
    const feeInfo = this.studentDashboard()?.fee_info;
    if (!feeInfo) {
      return this.configuredTotalSchoolFees();
    }
    const paidAmount = Math.max(0, feeInfo.total_paid);
    const dueAmount = Math.max(0, feeInfo.total_due);
    const totalAmount = paidAmount + dueAmount;
    return totalAmount > 0 ? totalAmount : this.configuredTotalSchoolFees();
  });

  readonly dashboardPaymentProgressPercent = computed(() => {
    const feeInfo = this.studentDashboard()?.fee_info;
    if (!feeInfo) {
      return this.paymentProgressPercent();
    }
    const paidAmount = Math.max(0, feeInfo.total_paid);
    const dueAmount = Math.max(0, feeInfo.total_due);
    const totalAmount = paidAmount + dueAmount;
    if (totalAmount <= 0) {
      return paidAmount > 0 ? 100 : 0;
    }
    return Math.max(0, Math.min(100, Math.round((paidAmount / totalAmount) * 100)));
  });

  readonly dashboardOutstandingInstallmentLabel = computed(() => {
    const feeInfo = this.studentDashboard()?.fee_info;
    if (!feeInfo) {
      return this.outstandingInstallmentLabel();
    }
    if (feeInfo.total_due <= 0) {
      return 'Paid in full';
    }
    const installmentNo = feeInfo.number_of_payments + 1;
    return `${installmentNo}${this.ordinalSuffix(installmentNo)} Installment`;
  });

  readonly dashboardRegisteredCoursesCount = computed(() =>
    this.studentDashboard()?.courses_info.registered_courses ?? this.totalCoursesSelected()
  );

  readonly dashboardRegisteredUnitsCount = computed(() =>
    this.studentDashboard()?.courses_info.units ?? this.totalUnitsSelected()
  );

  readonly dashboardFailedCoursesCount = computed(() =>
    this.studentDashboard()?.courses_info.failed_courses ?? this.carryoverCourses().length
  );

  readonly dashboardFailedCoursesLabel = computed(() => {
    const failedCoursesCount = this.dashboardFailedCoursesCount();
    return `${failedCoursesCount} Failed ${failedCoursesCount === 1 ? 'course' : 'courses'}`;
  });

  readonly dashboardCgpaDisplay = computed(() => this.formatDecimal(this.studentDashboard()?.cgpa ?? this.cumulativeGpa()));

  readonly dashboardCgpaClass = computed(() =>
    this.studentDashboard() ? this.resolveCgpaClassLabel(this.studentDashboard()!.cgpa) : this.gpaClass()
  );

  readonly dashboardGpaDeltaLabel = computed(() => {
    const previousCgpa = this.studentDashboard()?.previous_cgpa;
    if (previousCgpa === undefined || previousCgpa === null) {
      return this.gpaDelta();
    }
    return `from ${this.formatDecimal(previousCgpa)}`;
  });

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
    this.schoolFeeInstallments().reduce((sum, entry) => sum + entry.amount, 0)
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

  readonly effectiveHostelStatus = computed<HostelApplicationStatus>(() => this.hostelApplicationStatus());

  readonly selectedHostelOption = computed(() => {
    const preferredHostel = this.hostelApplicationDraft().preferredHostel;
    return this.availableHostels().find((hostel) => hostel.id === preferredHostel) ?? null;
  });

  readonly availableRoomOptions = computed<StudentHostelRoomOption[]>(() => {
    const selectedHostel = this.selectedHostelOption();
    return selectedHostel?.rooms ?? [];
  });

  readonly semesterResultGpa = computed<number | null>(() => this.studentResults()?.semester_gpa ?? 3.85);

  readonly formattedSemesterResultGpa = computed(() => this.formatNullableDecimal(this.semesterResultGpa()));

  readonly formattedCurrentCgpa = computed(() => this.formatDecimal(this.currentCgpa()));

  readonly selectedSemesterLabel = computed(() => this.selectedResultSemester() || this.semester());

  readonly cgpaTrackerCurrent = computed(() => this.formatDecimal(this.studentCgpaTrend()?.current_cgpa ?? this.currentCgpa()));

  readonly cgpaTrackerBest = computed(() => this.formatDecimal(this.studentCgpaTrend()?.best_cgpa ?? this.bestSemesterGpa()));

  readonly cgpaTrackerWorst = computed(() => this.formatDecimal(this.studentCgpaTrend()?.worst_cgpa ?? this.lowestSemesterGpa()));

  readonly cgpaTrackerCompletedSummary = computed(() => {
    const completed = this.studentCgpaTrend()?.semester_completed ?? this.semestersCompleted();
    const total = Math.max(completed, this.studentCgpaTrend()?.trend.length ?? this.semestersTotal());
    return {
      completed,
      total,
      remaining: Math.max(0, total - completed)
    };
  });

  readonly cgpaTrackerTrendLabel = computed(() => {
    const trend = this.studentCgpaTrend();
    if (!trend) {
      return 'No trend data';
    }
    const latest = trend.current_cgpa;
    const previous = trend.trend.length > 1 ? trend.trend[trend.trend.length - 2]?.cgpa ?? null : null;
    if (previous === null) {
      return 'Stable';
    }
    if (latest > previous) {
      return 'Trending Up';
    }
    if (latest < previous) {
      return 'Trending Down';
    }
    return 'Stable';
  });

  readonly cgpaTrackerTrendPoints = computed<SemesterGpaPoint[]>(() => {
    const trend = this.studentCgpaTrend()?.trend;
    if (!trend || trend.length === 0) {
      return this.semesterGpaPoints();
    }
    return trend.map((item) => ({
      label: `${item.semester}\n${item.session}`,
      value: item.cgpa,
      active: true
    }));
  });

  readonly cgpaTrackerBestLabel = computed(() => this.describeCgpaTrendPoint(this.studentCgpaTrend()?.trend, 'best'));

  readonly cgpaTrackerWorstLabel = computed(() => this.describeCgpaTrendPoint(this.studentCgpaTrend()?.trend, 'worst'));

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
      feeId: 'school-fees',
      paymentType: 'School Fees',
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
    const result = this.recordAuxiliaryFeePayment(feeId, target.amount, target.name);
    if (!result.ok) {
      return result;
    }
    const updated = this.fees().map((fee) =>
      fee.id === feeId ? { ...fee, status: 'paid' as const } : fee
    );
    this.fees.set(updated);
    return { ok: true, message: `${target.name} payment recorded.` };
  }

  recordAuxiliaryFeePayment(feeId: string, amount: number, paymentType: string): { ok: boolean; message: string; referenceNo?: string } {
    const target = this.fees().find((fee) => fee.id === feeId);
    if (!target) {
      return { ok: false, message: 'Fee item not found.' };
    }
    const normalizedAmount = Math.floor(amount || 0);
    if (normalizedAmount <= 0) {
      return { ok: false, message: 'Enter a valid payment amount.' };
    }
    const paidAt = new Date();
    const referenceNo = `RET-${paidAt.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const entry: ReturningPaymentRecord = {
      feeId,
      paymentType,
      installmentLabel: paymentType,
      amount: normalizedAmount,
      paidAt,
      referenceNo
    };
    this.paymentHistory.set([...this.paymentHistory(), entry]);
    this.fees.set(
      this.fees().map((fee) =>
        fee.id === feeId ? { ...fee, status: 'paid' as const } : fee
      )
    );
    return { ok: true, message: `${paymentType} payment recorded.`, referenceNo };
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

  async updateAccountPassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ ok: boolean; message: string }> {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return { ok: false, message: 'Please fill all password fields.' };
    }
    if (newPassword.length < 8) {
      return { ok: false, message: 'New password must be at least 8 characters.' };
    }
    if (newPassword !== confirmPassword) {
      return { ok: false, message: 'Confirm password does not match new password.' };
    }

    try {
      await firstValueFrom(
        this.appService.changePassword({
          password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword
        })
      );
      return { ok: true, message: 'Password updated successfully.' };
    } catch (error) {
      return {
        ok: false,
        message: this.resolvePasswordChangeErrorMessage(error)
      };
    }
  }

  updateHostelDraft(patch: Partial<HostelApplicationPayload>): void {
    const currentDraft = this.hostelApplicationDraft();
    const shouldResetPreferredBlock =
      typeof patch.preferredHostel === 'string' &&
      patch.preferredHostel !== currentDraft.preferredHostel &&
      !('preferredBlock' in patch);

    this.hostelApplicationDraft.set({
      ...currentDraft,
      ...patch,
      preferredBlock: shouldResetPreferredBlock ? '' : (patch.preferredBlock ?? currentDraft.preferredBlock)
    });
  }

  startHostelModificationRequest(): void {
    this.hostelApplicationDraft.set({
      academicSession: this.session(),
      preferredHostel: '',
      preferredBlock: '',
      specialNeeds: '',
      acknowledged: false
    });
    this.hostelApplicationStatus.set('request');
  }

  submitHostelApplication(payload: HostelApplicationPayload): { ok: boolean; message: string } {
    const selectedHostel = this.availableHostels().find((hostel) => hostel.id === payload.preferredHostel) ?? null;
    const requiresRoomSelection = (selectedHostel?.rooms.length ?? 0) > 0;

    if (!payload.academicSession || !payload.preferredHostel || (requiresRoomSelection && !payload.preferredBlock)) {
      return { ok: false, message: 'Complete all required hostel modification fields.' };
    }
    if (!payload.acknowledged) {
      return { ok: false, message: 'You must acknowledge hostel rules before submission.' };
    }
    this.hostelApplicationDraft.set(payload);
    this.hostelApplicationDate.set(new Date());
    this.hostelApplicationStatus.set('pending');
    return { ok: true, message: 'Hostel modification request submitted successfully.' };
  }

  setHostelApplicationStatus(status: HostelApplicationStatus): void {
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
      const response = await firstValueFrom(this.appService.getStudentFeePlans());
      this.fees.set(this.mapFeeItems(response.data));
      const selectedPlan = selectStudentFeePlan(response.data);
      this.studentFeePlan.set(selectedPlan);
      this.studentSchoolFeeStatus.set(
        selectedPlan?.payment_status
          ? {
              ...selectedPlan,
              payment_status: selectedPlan.payment_status
            }
          : null
      );
      this.syncReturningModuleAccess();
    } catch {
      this.fees.set([]);
      this.studentFeePlan.set(null);
      this.studentSchoolFeeStatus.set(null);
      this.syncReturningModuleAccess();
    } finally {
      this.loadingStudentFeePlan.set(false);
    }
  }

  async loadStudentDashboard(forceReload = false): Promise<void> {
    const userType = this.authSessionStore.userType().toLowerCase().trim();
    if (userType && !userType.includes('student')) {
      return;
    }
    if (this.hasLoadedStudentDashboard() && !forceReload) {
      return;
    }
    this.loadingStudentDashboard.set(true);
    try {
      const response = await firstValueFrom(this.appService.getStudentDashboard());
      this.studentDashboard.set(response);
      this.hasLoadedStudentDashboard.set(true);
      this.studentName.set(response.full_name || this.studentName());
      this.matricNo.set(response.matriculation_number || this.matricNo());
      this.program.set(response.department || this.program());
      this.session.set(response.academic_year || this.session());
      this.level.set(response.current_level || this.level());
      this.semester.set(response.current_semester || this.semester());
      this.cumulativeGpa.set(response.cgpa);
      this.currentCgpa.set(response.cgpa);
      this.gpaClass.set(this.resolveCgpaClassLabel(response.cgpa));
      this.gpaDelta.set(`from ${this.formatDecimal(response.previous_cgpa)}`);
      if ((response.fee_info.total_paid > 0 || response.fee_info.total_due <= 0) && !this.hasPaidStatus(this.authSessionStore.paymentStatus())) {
        this.authSessionStore.setPaymentStatus('paid');
      }
      this.syncReturningModuleAccess();
    } finally {
      this.loadingStudentDashboard.set(false);
    }
  }

  async loadStudentResults(forceReload = false): Promise<void> {
    if (this.studentResults() && !forceReload) {
      return;
    }
    this.loadingStudentResults.set(true);
    try {
      const response = await firstValueFrom(this.appService.getStudentResults());
      this.studentResults.set(response);
      this.studentName.set(response.student_name || this.studentName());
      this.matricNo.set(response.matric_no || this.matricNo());
      this.program.set(response.program || this.program());
      this.level.set(response.level || this.level());
      this.semester.set(response.semester || this.semester());
      this.session.set(response.session || this.session());
      this.selectedResultSemester.set(response.semester || this.selectedResultSemester());
      this.resultSemesterOptions.set(response.semester ? [response.semester] : this.resultSemesterOptions());
      this.semesterResultRows.set(
        response.results.map((result) => {
          const caScore = result.test_score ?? 0;
          const examScore = result.exam_score ?? 0;
          return {
            code: result.course_code,
            title: result.course_name,
            units: null,
            ca: caScore,
            exam: examScore,
            total: caScore + examScore,
            grade: result.grade
          };
        })
      );
    } finally {
      this.loadingStudentResults.set(false);
    }
  }

  async loadStudentCgpaTrend(forceReload = false): Promise<void> {
    if (this.studentCgpaTrend() && !forceReload) {
      return;
    }
    this.loadingStudentCgpaTrend.set(true);
    try {
      const response = await firstValueFrom(this.appService.getStudentCgpaTrend());
      this.studentCgpaTrend.set(response);
      this.currentCgpa.set(response.current_cgpa);
      this.cumulativeGpa.set(response.current_cgpa);
      this.bestSemesterGpa.set(response.best_cgpa);
      this.lowestSemesterGpa.set(response.worst_cgpa);
      this.semestersCompleted.set(response.semester_completed);
      this.semestersTotal.set(Math.max(response.semester_completed, response.trend.length || this.semestersTotal()));
      this.gpaClass.set(this.resolveCgpaClassLabel(response.current_cgpa));
    } finally {
      this.loadingStudentCgpaTrend.set(false);
    }
  }

  async loadHostelAllocation(forceReload = false): Promise<void> {
    if (this.hasLoadedHostelAllocation() && !forceReload) {
      return;
    }

    this.loadingHostelAllocation.set(true);
    try {
      const allocation = await firstValueFrom(this.appService.getStudentHostelAllocation());
      this.setHostelAllocation(allocation);
      this.hasLoadedHostelAllocation.set(true);
    } catch {
      this.hostelAllocation.set({
        hostelName: '',
        block: '',
        roomNumber: '',
        floor: '',
        roomType: '',
        bed: ''
      });
      this.hasLoadedHostelAllocation.set(true);
    } finally {
      this.loadingHostelAllocation.set(false);
    }
  }

  async loadHostelOptions(forceReload = false): Promise<void> {
    if (this.hasLoadedHostelOptions() && !forceReload) {
      return;
    }

    this.loadingHostelOptions.set(true);
    try {
      const response = await firstValueFrom(this.appService.getHostels());
      this.availableHostels.set(response.results);
      this.hasLoadedHostelOptions.set(true);
    } catch {
      this.availableHostels.set([]);
      this.hasLoadedHostelOptions.set(true);
    } finally {
      this.loadingHostelOptions.set(false);
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
      this.registeredCourses.set(flattenRegisteredCoursesResponse(response));
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
        feeId: 'school-fees',
        paymentType: `School Fees - ${entry.installmentLabel}`,
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

  formatDecimal(value: number): string {
    return value.toFixed(2);
  }

  formatNullableDecimal(value: number | null): string {
    return value === null ? '—' : this.formatDecimal(value);
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

    const nextTotalPaid = currentStatus.payment_status.total_paid + amount;
    const nextTotalDue = Math.max(0, currentStatus.payment_status.total_due - amount);

    this.studentSchoolFeeStatus.set({
      ...currentStatus,
      payment_status: {
        total_paid: nextTotalPaid,
        total_due: nextTotalDue,
        number_of_payments: currentStatus.payment_status.number_of_payments + 1,
        status: nextTotalDue <= 0 ? 'paid' : 'partially_paid'
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

  private mapFeeItems(plans: StudentFeePlan[]): FeeItem[] {
    return plans
      .slice()
      .sort((leftPlan, rightPlan) => leftPlan.display_order - rightPlan.display_order)
      .map((plan) => ({
        id: plan.label === 'school_fee' ? 'school-fees' : this.normalizeFeeIdentifier(plan.label || plan.name),
        name: plan.name,
        amount: plan.amount,
        status: this.resolveFeeStatus(plan),
        type: 'mandatory',
        referenceId: String(plan.id)
      }));
  }

  private resolveFeeStatus(plan: StudentFeePlan): FeeItem['status'] {
    const paymentStatus = plan.payment_status;
    if (!paymentStatus) {
      return 'unpaid';
    }
    if (paymentStatus.status === 'paid' || paymentStatus.total_due <= 0) {
      return 'paid';
    }
    if (paymentStatus.total_paid > 0 || paymentStatus.number_of_payments > 0) {
      return 'remaining';
    }
    return 'unpaid';
  }

  private normalizeFeeIdentifier(value: string): string {
    return (value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private setHostelAllocation(allocation: StudentHostelAllocation): void {
    const normalizedAllocation = {
      hostelName: allocation.hostelName,
      block: allocation.block,
      roomNumber: allocation.roomNumber,
      floor: allocation.floor,
      roomType: allocation.roomType,
      bed: allocation.bed
    };

    this.hostelAllocation.set(normalizedAllocation);
    const hasAllocation = Object.values(normalizedAllocation).some((value) => value.trim().length > 0);
    this.hostelApplicationStatus.set(hasAllocation ? 'allocated' : 'request');
  }

  private resolvePasswordChangeErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const errorPayload = this.toRecord(error.error);
      return this.readErrorMessage(errorPayload)
        ?? error.message
        ?? 'Unable to update password right now.';
    }
    return 'Unable to update password right now.';
  }

  private readErrorMessage(source: Record<string, unknown>): string | null {
    const errorMessageKeys = ['message', 'detail', 'error', 'non_field_errors'];
    for (const key of errorMessageKeys) {
      const value = source[key];
      if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
      }
      if (Array.isArray(value) && typeof value[0] === 'string' && value[0].trim().length > 0) {
        return value[0].trim();
      }
    }
    return null;
  }

  private toRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }
    return value as Record<string, unknown>;
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

  private normalizeDashboardAnnouncements(
    announcements: StudentDashboardAnnouncement[]
  ): ReturningAnnouncementFeedItem[] {
    return announcements.map((announcement) => {
      const title = (announcement.title || '').trim();
      const body = (announcement.body || announcement.message || announcement.description || '').trim();
      const timeAgo = (announcement.time_ago || '').trim()
        || this.formatAnnouncementTime(announcement.updated_at || announcement.created_at || '');
      return {
        title: title || 'Announcement',
        body: body || 'No announcement details available.',
        timeAgo: timeAgo || 'Recently'
      };
    });
  }

  private formatAnnouncementTime(value: string): string {
    if (!value) {
      return '';
    }
    const timestamp = Date.parse(value);
    if (Number.isNaN(timestamp)) {
      return '';
    }
    const diffMs = Date.now() - timestamp;
    const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));
    if (diffMinutes < 1) {
      return 'Just now';
    }
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  private resolveCgpaClassLabel(cgpa: number): string {
    if (cgpa >= 4.5) {
      return 'First Class';
    }
    if (cgpa >= 3.5) {
      return 'Second Class Upper';
    }
    if (cgpa >= 2.4) {
      return 'Second Class Lower';
    }
    if (cgpa >= 1.5) {
      return 'Third Class';
    }
    if (cgpa >= 1) {
      return 'Pass';
    }
    return 'Fail';
  }

  private describeCgpaTrendPoint(
    trend: StudentCgpaTrendResponse['trend'] | undefined,
    mode: 'best' | 'worst'
  ): string {
    if (!trend || trend.length === 0) {
      return 'No semester data';
    }
    const target = trend.reduce((selected, current) => {
      if (!selected) {
        return current;
      }
      if (mode === 'best') {
        return current.cgpa > selected.cgpa ? current : selected;
      }
      return current.cgpa < selected.cgpa ? current : selected;
    }, trend[0]);
    return `${target.semester} ${target.session}`.trim();
  }
}
