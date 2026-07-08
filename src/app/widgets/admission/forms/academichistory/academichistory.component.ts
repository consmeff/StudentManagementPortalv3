import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';

// Services
import { FormService } from '../../../services/form.service';
import { RegStoreService } from '../../../../services/regstore.service';
import { ApplicationService } from '../../../../services/application.service';
import { formstepDTO } from '../../../../data/application/form.dto';
import { AcademicHistory, OLevelResult, RegistrantDataDTO } from '../../../../data/application/registrantdatadto';
import { extractLastYearFromText, getPastYears } from '../../../../utility/yearutil';
import { ExamRecord, TAcademicHistory, TOLevelResult, TPersonalDetailDTO, TUtmeResultPayload } from '../../../../data/application/transformer.dto';
import { ACADEMIC_HISTORY_RULES } from '../../../../constants/academic-history.constants';
import { formatDateOnly, parseDateOnly } from '../../../../utility/date-only';

@Component({
  selector: 'app-academichistory',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    RadioButtonModule,
    ButtonModule
  ],
  templateUrl: './academichistory.component.html',
  styleUrl: './academichistory.component.scss'
})
export class AcademicHistoryComponent implements OnInit {
  _formStepService = inject(FormService);

  regstore = inject(RegStoreService);

  appservice = inject(ApplicationService);

  cd = inject(ChangeDetectorRef);

  formStepStatus: formstepDTO = {
    academicValid: false,
    docUploadValid: false,
    nextofkinValid: false,
    personalinfoValid: false
  };

  academicHistoryPrimaryForm!: FormGroup;

  academicHistorySecondaryForm!: FormGroup;

  jambDetailsForm!: FormGroup;

  academicHistoryExamsForm!: FormGroup;

  academicHistoryOtherQualificationForm!: FormGroup;

  backendRegistrationData!: RegistrantDataDTO;

  draftPersonalData: TPersonalDetailDTO | null = null;

  draftAcademicHistory: TAcademicHistory[] | null = null;

  draftOLevelResults: TOLevelResult[] | null = null;

  draftUtmeResult: TUtmeResultPayload | null = null;

  examOptions: string[] = [];

  examDropdownOptions: any[] = [];

  years = getPastYears();

  yearDropdownOptions: any[] = [];

  grades: string[] = ['A', 'B'];

  gradeDropdownOptions: any[] = [];

  readonly academicHistoryRules = ACADEMIC_HISTORY_RULES;

  examnumform: FormGroup = new FormGroup({
    attempt: new FormControl('1', Validators.required)
  });

  attemptOptions = ['1', '2'];

  isEditable = true;

  constructor(private fb: FormBuilder) {
    this.academicHistoryOtherQualificationForm = this.fb.group({
      qualifications: this.fb.array([this.createQualificationGroup()])
    });

    this.academicHistoryExamsForm = this.fb.group({
      examattemptcount: this.fb.array([this.createAcademicHistoryGroup()])
    });

    this._formStepService.formsteps$.subscribe((step: formstepDTO) => {
      this.formStepStatus = step;
    });

    this._formStepService.applicationEditable$.subscribe((editable) => {
      this.isEditable = editable;
      this.applyEditableState();
    });

    this._formStepService.academicHistory$.subscribe((data) => {
      this.draftAcademicHistory = data;
    });

    this._formStepService.personalform$.subscribe((data) => {
      this.draftPersonalData = data;
    });

    this._formStepService.olevelResult$.subscribe((data) => {
      this.draftOLevelResults = data;
    });

    this._formStepService.utmeResult$.subscribe((data) => {
      this.draftUtmeResult = data;
    });

    this.regstore.preRegData$.subscribe(data => {
      if (data != undefined) {
        this.examOptions = data.certificate_types;
        this.examDropdownOptions = data.certificate_types.map(exam => ({
          label: exam,
          value: exam
        }));

        this.grades = data.subject_grades;
        this.gradeDropdownOptions = data.subject_grades.map(grade => ({
          label: grade,
          value: grade
        }));
      }
    });

    // Transform years to dropdown options
    this.yearDropdownOptions = this.years.map(year => ({
      label: year.toString(),
      value: year.toString()
    }));

    this.examnumform.valueChanges.subscribe(val => {
      if (+val.attempt == 1 && this.examAttemptCountArray().length != 1) {
        this.removeExamAttempt(1);
      }
      if (+val.attempt == 2 && this.examAttemptCountArray().length != 2) {
        this.addExamAttempt();
      }
      this.cd.detectChanges();
    });

    this.regstore.regData$.subscribe(data => {
      if (data != null) {
        this.backendRegistrationData = data;
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    const academicHistorySource = this.draftAcademicHistory ?? this.backendRegistrationData?.data?.academic_history ?? [];
    const _primary = academicHistorySource
      ?.filter(f => f.certificate_type === "Primary School Leaving Certificate")?.[0] ?? null;

    const _sec = academicHistorySource
      ?.filter(f => f.certificate_type === "SSSCE")?.[0] ?? null;

    const _more = academicHistorySource
      ?.filter(f => f.certificate_type !== "SSSCE" && f.certificate_type !== "Primary School Leaving Certificate") ?? null;

    this.academicHistoryPrimaryForm = this.fb.group({
      name: [_primary?.institution ?? '', Validators.required],
      qualificationType: [_primary?.certificate_type ?? "Primary School Leaving Certificate", Validators.required],
      datestarted: [_primary?.from_date ? new Date(_primary.from_date) : null, Validators.required],
      datecompleted: [_primary?.to_date ? new Date(_primary.to_date) : null, Validators.required]
    });

    this.academicHistorySecondaryForm = this.fb.group({
      name: [_sec?.institution ?? '', Validators.required],
      qualificationType: [_sec?.certificate_type ?? "SSSCE", Validators.required],
      datestarted: [_sec?.from_date ? new Date(_sec.from_date) : null, Validators.required],
      datecompleted: [_sec?.to_date ? new Date(_sec.to_date) : null, Validators.required]
    });

    const regData = (this.backendRegistrationData?.data as any) ?? {};
    const utmeData = regData.utme_result;
    this.jambDetailsForm = this.fb.group({
      registrationNumber: [
        this.draftUtmeResult?.utme_reg_no ?? regData.utme_reg_no ?? utmeData?.utme_reg_no ?? '',
        [
          Validators.required,
          Validators.maxLength(ACADEMIC_HISTORY_RULES.jambRegistrationNumberMaxLength),
          Validators.pattern(/^[a-zA-Z0-9]+$/)
        ]
      ],
      score: [
        this.draftUtmeResult?.score ?? utmeData?.score ?? null,
        [
          Validators.required,
          Validators.min(ACADEMIC_HISTORY_RULES.jambScoreMin),
          Validators.max(ACADEMIC_HISTORY_RULES.jambScoreMax)
        ]
      ]
    });

    const _exams = this.draftOLevelResults ?? this.backendRegistrationData?.data?.o_level_result;
    if (_exams != undefined && _exams.length > 0 && _exams[0].subjects != undefined) {
      this.clearExamAttempt();
      _exams.forEach((exam) => this.addExamAttempt(exam));
      this.examnumform.get('attempt')?.setValue(`${Math.min(_exams.length, 2)}`);
    }

    if (_more != null && _more.length > 0) {
      this.qualificationsArray().clear();
      _more.forEach((item) => this.addQualification(item));
    }

    this.setupListeners();
    this.applyEditableState();
  }

  setupListeners() {
    this.academicHistoryPrimaryForm.valueChanges.subscribe(() => {
      this.validateAndUpdate();
    });

    this.academicHistorySecondaryForm.valueChanges.subscribe(() => {
      this.validateAndUpdate();
    });

    this.academicHistoryExamsForm.valueChanges.subscribe(() => {
      this.validateAndUpdate();
    });

    this.jambDetailsForm.valueChanges.subscribe(() => {
      this.validateAndUpdate();
    });

    this.examAttemptCountArray().valueChanges.subscribe(() => {
      this.validateAndUpdate();
    });

    this.academicHistoryOtherQualificationForm.valueChanges.subscribe(() => {
      this.validateAndUpdate();
    });

    setTimeout(() => {
      const control = this.academicHistoryExamsForm.get('examattemptcount.0.year');
      control?.setValue(control.value);
      control?.markAsDirty();
    }, 1000);
  }

  validateAndUpdate() {
    const dateRangesValid = this.areDateRangesValid();
    const completionAgeValid = this.areCompletionAgeRulesValid();
    const optionalQualificationsValid = this.areOptionalQualificationsValid();
    if (this.academicHistoryPrimaryForm.valid && 
        this.academicHistorySecondaryForm.valid && 
        this.academicHistoryExamsForm.valid &&
        this.jambDetailsForm.valid &&
        dateRangesValid &&
        completionAgeValid &&
        optionalQualificationsValid) {
      this.formStepStatus.academicValid = true;
      this.preparePayload();
      this._formStepService.setFormSteps(this.formStepStatus);
    } else {
      this.formStepStatus.academicValid = false;
      this._formStepService.setFormSteps(this.formStepStatus);
    }
  }

  preparePayload() {
    const ex: TOLevelResult[] = [];
    this.academicHistoryExamsForm.value.examattemptcount.forEach((_element: any) => {
      const element = _element as ExamRecord;
      const _n = element.name;
      const _d = element.year;
      ex.push({
        name: `${_n}/${_d}`,
        subjects: Object.entries(element)
          .filter(([key]) => !["name", "year"].includes(key))
          .map(([subject, grade]) => ({ subject, grade }))
      });
    });

    this._formStepService.setOlevelResultFormData(ex);
    const rawRegNo = this.jambDetailsForm.value.registrationNumber;
    const rawScore = this.jambDetailsForm.value.score;
    const parsedScore = rawScore === '' || rawScore === undefined || rawScore === null ? null : Number(rawScore);
    const normalizedScore = typeof parsedScore === 'number' && Number.isFinite(parsedScore) ? parsedScore : null;
    const utmePayload: TUtmeResultPayload = {
      utme_reg_no: (rawRegNo || '').trim(),
      score: normalizedScore
    };
    this._formStepService.setUtmeResultFormData(utmePayload);

    const ah: TAcademicHistory[] = [
      {
        institution: this.academicHistoryPrimaryForm.value.name,
        certificate_type: this.academicHistoryPrimaryForm.value.qualificationType,
        from_date: this.formatDate(this.academicHistoryPrimaryForm.value.datestarted),
        to_date: this.formatDate(this.academicHistoryPrimaryForm.value.datecompleted)
      },
      {
        institution: this.academicHistorySecondaryForm.value.name,
        certificate_type: this.academicHistorySecondaryForm.value.qualificationType,
        from_date: this.formatDate(this.academicHistorySecondaryForm.value.datestarted),
        to_date: this.formatDate(this.academicHistorySecondaryForm.value.datecompleted)
      }
    ];

    const validOptionalQualifications = this.getValidOptionalQualifications();
    validOptionalQualifications.forEach((element: any) => {
      ah.push({
        institution: element.name,
        certificate_type: element.qualificationType,
        from_date: this.formatDate(element.dateStarted),
        to_date: this.formatDate(element.dateCompleted)
      });
    });

    this._formStepService.setAcademicHistoryFormData(ah);
  }

  formatDate(date: Date | string | null): string {
    return formatDateOnly(date);
  }

  examAttemptCountArray(): FormArray {
    return this.academicHistoryExamsForm.get('examattemptcount') as FormArray;
  }

  qualificationsArray(): FormArray {
    return this.academicHistoryOtherQualificationForm.get('qualifications') as FormArray;
  }

  createQualificationGroup(item?: TAcademicHistory | AcademicHistory): FormGroup {
    return this.fb.group({
      name: [item?.institution ?? ''],
      qualificationType: [item?.certificate_type ?? null],
      dateStarted: [parseDateOnly(item?.from_date ?? null)],
      dateCompleted: [parseDateOnly(item?.to_date ?? null)],
    });
  }

  createAcademicHistoryGroup(exam?: TOLevelResult | OLevelResult): FormGroup {
    if (exam == undefined) {
      return this.fb.group({
        name: [null, Validators.required],
        year: [null, Validators.required],
        english: [null, Validators.required],
        math: [null, Validators.required],
        physics: [null, Validators.required],
        chemistry: [null, Validators.required],
        biology: [null, Validators.required],
      });
    } 
      return this.fb.group({
        name: [exam.name.replace(/\/\d{4}/g, ""), Validators.required],
        year: [extractLastYearFromText(exam.name), Validators.required],
        english: [exam.subjects.find(f => f.subject.includes("english"))?.grade || null, Validators.required],
        math: [exam.subjects.find(f => f.subject.includes("math"))?.grade || null, Validators.required],
        physics: [exam.subjects.find(f => f.subject.includes("physic"))?.grade || null, Validators.required],
        chemistry: [exam.subjects.find(f => f.subject.includes("chemistry"))?.grade || null, Validators.required],
        biology: [exam.subjects.find(f => f.subject.includes("biology"))?.grade || null, Validators.required],
      });
    
  }

  addQualification(item?: TAcademicHistory | AcademicHistory): void {
    this.qualificationsArray().push(this.createQualificationGroup(item));
  }

  removeQualification(index: number): void {
    this.qualificationsArray().removeAt(index);
  }

  addExamAttempt(exam?: TOLevelResult | OLevelResult): void {
    this.examAttemptCountArray().push(this.createAcademicHistoryGroup(exam));
  }

  clearExamAttempt() {
    this.examAttemptCountArray().clear();
  }

  removeExamAttempt(index: number): void {
    this.examAttemptCountArray().removeAt(index);
  }

  onJambRegistrationNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, ACADEMIC_HISTORY_RULES.jambRegistrationNumberMaxLength);

    if (sanitizedValue === input.value) {
      return;
    }

    input.value = sanitizedValue;
    this.jambDetailsForm.get('registrationNumber')?.setValue(sanitizedValue);
  }

  onJambScoreInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const rawValue = input.value;
    if (rawValue === '') {
      this.jambDetailsForm.get('score')?.setValue(null);
      return;
    }

    const numericValue = Number(rawValue);
    if (!Number.isFinite(numericValue)) {
      return;
    }

    const normalizedScore = Math.min(
      Math.max(numericValue, ACADEMIC_HISTORY_RULES.jambScoreMin),
      ACADEMIC_HISTORY_RULES.jambScoreMax
    );

    if (normalizedScore === numericValue) {
      return;
    }

    input.value = `${normalizedScore}`;
    this.jambDetailsForm.get('score')?.setValue(normalizedScore);
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isFieldInvalidArray(formArray: FormArray, index: number, fieldName: string): boolean {
    const field = formArray.at(index).get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isDateOrderInvalid(form: FormGroup): boolean {
    const start = form.get('datestarted')?.value;
    const end = form.get('datecompleted')?.value;
    if (!start || !end) {
      return false;
    }
    return new Date(end) < new Date(start);
  }

  isPrimarySchoolCompletionAgeInvalid(): boolean {
    return this.isSchoolCompletionAgeInvalid(
      this.academicHistoryPrimaryForm,
      ACADEMIC_HISTORY_RULES.primarySchoolMinimumCompletionAge
    );
  }

  isSecondarySchoolCompletionAgeInvalid(): boolean {
    return this.isSchoolCompletionAgeInvalid(
      this.academicHistorySecondaryForm,
      ACADEMIC_HISTORY_RULES.secondarySchoolMinimumCompletionAge
    );
  }

  isOptionalQualificationIncomplete(index: number): boolean {
    const qualification = this.qualificationsArray().at(index) as FormGroup;
    const {value} = qualification;
    const hasAnyValue = Object.values(value).some((v) => this.hasFilledValue(v));
    const hasAllValue = Object.values(value).every((v) => this.hasFilledValue(v));
    return hasAnyValue && !hasAllValue;
  }

  private areDateRangesValid(): boolean {
    if (this.isDateOrderInvalid(this.academicHistoryPrimaryForm)) {
      return false;
    }
    if (this.isDateOrderInvalid(this.academicHistorySecondaryForm)) {
      return false;
    }

    return this.getValidOptionalQualifications().every((item) => {
      const start = item.dateStarted;
      const end = item.dateCompleted;
      if (!start || !end) {
        return false;
      }
      return new Date(end) >= new Date(start);
    });
  }

  private areCompletionAgeRulesValid(): boolean {
    return !this.isPrimarySchoolCompletionAgeInvalid()
      && !this.isSecondarySchoolCompletionAgeInvalid();
  }

  private areOptionalQualificationsValid(): boolean {
    return this.qualificationsArray().controls.every((group) => {
      const {value} = (group as FormGroup);
      const values = Object.values(value);
      const hasAnyValue = values.some((v) => this.hasFilledValue(v));
      const hasAllValue = values.every((v) => this.hasFilledValue(v));
      return !hasAnyValue || hasAllValue;
    });
  }

  private getValidOptionalQualifications(): any[] {
    return this.qualificationsArray().value.filter((item: any) =>
      this.hasFilledValue(item?.name) &&
      this.hasFilledValue(item?.qualificationType) &&
      this.hasFilledValue(item?.dateStarted) &&
      this.hasFilledValue(item?.dateCompleted)
    );
  }

  private hasFilledValue(value: unknown): boolean {
    if (value instanceof Date) {
      return !Number.isNaN(value.getTime());
    }
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  }

  private isSchoolCompletionAgeInvalid(form: FormGroup, minimumAge: number): boolean {
    if (!form) {
      return false;
    }

    const completionDate = this.normalizeDateValue(form.get('datecompleted')?.value);
    const applicantDateOfBirth = this.getApplicantDateOfBirth();
    if (completionDate === null || applicantDateOfBirth === null) {
      return false;
    }

    return this.getAgeAtDate(applicantDateOfBirth, completionDate) < minimumAge;
  }

  private getApplicantDateOfBirth(): Date | null {
    const rawDateOfBirth = this.draftPersonalData?.dateOfBirth ?? this.backendRegistrationData?.data?.dob ?? null;
    return this.normalizeDateValue(rawDateOfBirth);
  }

  private normalizeDateValue(value: Date | string | null | undefined): Date | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const normalizedDate = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(normalizedDate.getTime())) {
      return null;
    }

    return normalizedDate;
  }

  private getAgeAtDate(dateOfBirth: Date, referenceDate: Date): number {
    let age = referenceDate.getFullYear() - dateOfBirth.getFullYear();
    const hasNotReachedBirthday =
      referenceDate.getMonth() < dateOfBirth.getMonth()
      || (
        referenceDate.getMonth() === dateOfBirth.getMonth()
        && referenceDate.getDate() < dateOfBirth.getDate()
      );

    if (hasNotReachedBirthday) {
      age -= 1;
    }

    return age;
  }

  private applyEditableState(): void {
    const forms = [
      this.academicHistoryPrimaryForm,
      this.academicHistorySecondaryForm,
      this.jambDetailsForm,
      this.academicHistoryExamsForm,
      this.academicHistoryOtherQualificationForm,
      this.examnumform
    ];

    forms.forEach((form) => {
      if (!form) {
        return;
      }
      if (this.isEditable) {
        form.enable({ emitEvent: false });
      } else {
        form.disable({ emitEvent: false });
      }
    });
  }
}
