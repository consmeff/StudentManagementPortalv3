import { Injectable, computed, signal } from '@angular/core';

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

@Injectable({ providedIn: 'root' })
export class ReturningFlowService {
  readonly studentName = signal('ISHOLA, Hassan Gbadebo');
  readonly matricNo = signal('CONSMMEFS/NUR/2024/0142');
  readonly programme = signal('Nursing Science');
  readonly session = signal('2025/2026');
  readonly level = signal('OND 2');
  readonly semester = signal('1st Semester');

  readonly cumulativeGpa = signal(3.78);
  readonly gpaClass = signal('Second Class Upper');
  readonly gpaDelta = signal('from 3.68');

  readonly totalSchoolFees = 600000;
  readonly minimumFirstPayment = 500000;
  readonly maxInstallments = 3;
  readonly paymentHistory = signal<ReturningPaymentRecord[]>([]);

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
  readonly hasInternalPayment = computed(() => this.paymentHistory().length > 0);
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

    if (this.courseReviewState() === 'locked') {
      this.courseReviewState.set('waiting');
    }
    return { ok: true, message: 'Payment recorded successfully.' };
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

  suggestedAmount(): number {
    if (!this.hasInternalPayment()) {
      return Math.min(this.minimumFirstPayment, this.outstandingAmount());
    }
    return this.outstandingAmount();
  }

  formatCurrency(value: number): string {
    return `₦${value.toLocaleString('en-NG')}`;
  }

  private ordinalSuffix(n: number): string {
    if (n % 10 === 1 && n % 100 !== 11) return 'st';
    if (n % 10 === 2 && n % 100 !== 12) return 'nd';
    if (n % 10 === 3 && n % 100 !== 13) return 'rd';
    return 'th';
  }
}
