import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';

// Services
import { FormService } from '../../../services/form.service';
import { RegStoreService } from '../../../../services/regstore.service';
import { ApplicationService } from '../../../../services/application.service';
import { formstepDTO } from '../../../../data/application/form.dto';
import { AcademicHistory, OLevelResult, RegistrantDataDTO } from '../../../../data/application/registrantdatadto';
import { extractLastYearFromText, getPastYears } from '../../../../utility/yearutil';
import { ExamRecord, TAcademicHistory, TOLevelResult } from '../../../../data/application/transformer.dto';

@Component({
  selector: 'app-academichistory',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    RadioButtonModule,
    ButtonModule
  ],
  templateUrl: './academichistory.component.html',
  styleUrl: './academichistory.component.scss'
})
export class AcademichistoryComponent {
  _formStepService = inject(FormService);
  regstore = inject(RegStoreService);
  appservice = inject(ApplicationService);
  cd = inject(ChangeDetectorRef);

  formStepStatus: formstepDTO = {
    academicValid: false,
    docuplodValid: false,
    nextofkinValid: false,
    personalinfoValid: false
  };

  academicHistoryPrimaryForm!: FormGroup;
  academicHistorySecondaryForm!: FormGroup;
  academicHistoryExamsForm!: FormGroup;
  academicHistoryOtherQualificationForm!: FormGroup;

  backendRegistrationData!: RegistrantDataDTO;

  examOptions: string[] = [];
  examDropdownOptions: any[] = [];
  years = getPastYears();
  yearDropdownOptions: any[] = [];
  grades: string[] = ['A', 'B'];
  gradeDropdownOptions: any[] = [];

  examnumform: FormGroup = new FormGroup({
    attempt: new FormControl('1', Validators.required)
  });

  attemptOptions = ['1', '2'];

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
      if (+val.attempt == 1 && this.examattemptcount.length != 1) {
        this.removeExamAttempt(1);
      }
      if (+val.attempt == 2 && this.examattemptcount.length != 2) {
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
    let _primary = this.backendRegistrationData?.data?.academic_history
      ?.filter(f => f.certificate_type === "Primary School Leaving Certificate")?.[0] ?? null;

    let _sec = this.backendRegistrationData?.data?.academic_history
      ?.filter(f => f.certificate_type === "SSSCE")?.[0] ?? null;

    let _more = this.backendRegistrationData?.data?.academic_history
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

    let _exams = this.backendRegistrationData?.data?.o_level_result;
    if (_exams != undefined && _exams.length > 0 && _exams[0].subjects != undefined) {
      this.clearExamAttempt();
      _exams.forEach((exam) => this.addExamAttempt(exam));
      this.examnumform.get('attempt')?.setValue(`${Math.min(_exams.length, 2)}`);
    }

    if (_more != null && _more.length > 0) {
      this.qualifications.clear();
      _more.forEach((item) => this.addQualification(item));
    }

    this.setupListeners();
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

    this.examattemptcount.valueChanges.subscribe(() => {
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
    const optionalQualificationsValid = this.areOptionalQualificationsValid();
    if (this.academicHistoryPrimaryForm.valid && 
        this.academicHistorySecondaryForm.valid && 
        this.academicHistoryExamsForm.valid &&
        dateRangesValid &&
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
    let ex: TOLevelResult[] = [];
    this.academicHistoryExamsForm.value.examattemptcount.forEach((_element: any) => {
      var element = _element as ExamRecord;
      let _n = element.name;
      let _d = element.year;
      ex.push({
        name: `${_n}/${_d}`,
        subjects: Object.entries(element)
          .filter(([key]) => !["name", "year"].includes(key))
          .map(([subject, grade]) => ({ subject, grade }))
      });
    });

    this._formStepService.setOlevelResultFormData(ex);

    let ah: TAcademicHistory[] = [
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
    if (!date) return '';
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
  }

  get examattemptcount(): FormArray {
    return this.academicHistoryExamsForm.get('examattemptcount') as FormArray;
  }

  get qualifications(): FormArray {
    return this.academicHistoryOtherQualificationForm.get('qualifications') as FormArray;
  }

  createQualificationGroup(item?: AcademicHistory): FormGroup {
    return this.fb.group({
      name: [item?.institution ?? ''],
      qualificationType: [item?.certificate_type ?? null],
      dateStarted: [item?.from_date ? new Date(item.from_date) : null],
      dateCompleted: [item?.to_date ? new Date(item.to_date) : null],
    });
  }

  createAcademicHistoryGroup(exam?: OLevelResult): FormGroup {
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
    } else {
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
  }

  addQualification(item?: AcademicHistory): void {
    this.qualifications.push(this.createQualificationGroup(item));
  }

  removeQualification(index: number): void {
    this.qualifications.removeAt(index);
  }

  addExamAttempt(exam?: OLevelResult): void {
    this.examattemptcount.push(this.createAcademicHistoryGroup(exam));
  }

  clearExamAttempt() {
    this.examattemptcount.clear();
  }

  removeExamAttempt(index: number): void {
    this.examattemptcount.removeAt(index);
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

  isOptionalQualificationIncomplete(index: number): boolean {
    const qualification = this.qualifications.at(index) as FormGroup;
    const value = qualification.value;
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

  private areOptionalQualificationsValid(): boolean {
    return this.qualifications.controls.every((group) => {
      const value = (group as FormGroup).value;
      const values = Object.values(value);
      const hasAnyValue = values.some((v) => this.hasFilledValue(v));
      const hasAllValue = values.every((v) => this.hasFilledValue(v));
      return !hasAnyValue || hasAllValue;
    });
  }

  private getValidOptionalQualifications(): any[] {
    return this.qualifications.value.filter((item: any) =>
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
}
