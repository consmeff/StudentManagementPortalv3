import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

// PrimeNG
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';

// Services
import { WidgetsService } from '../../widgets/services/widgets.service';
import { FormService } from '../../widgets/services/form.service';
import { RegStoreService } from '../../services/regstore.service';
import { ApplicationService } from '../../services/application.service';
import { formstepDTO } from '../../data/application/form.dto';
import { TAcademicHistory, TNextOfKinDTO, TOLevelResult, TPersonalDetailDTO, TUploadFile, TUtmeResultPayload } from '../../data/application/transformer.dto';
import { sidebarStateDTO } from '../../data/dashboard/dash.dto';
import { States } from '../../data/application/location.dto';
import { AcademicHistory, CertificateOfBirth, LGA, OLevelResult, RegistrantData, RegistrantDataDTO } from '../../data/application/registrantdatadto';
import { Address } from '../../data/application/personaldetailsdto';
import { AuthSessionStore } from '../../store/auth-session.store';
import { TraceabilityModule } from '../../shared/traceability.module';
import { normalizeApplicationStatusKey } from '../../constants/application-status.utils';
import { PersonalDetailsComponent } from '../../widgets/admission/forms/personaldetails/personaldetails.component';
import { NextOfKinComponent } from '../../widgets/admission/forms/nextofkin/nextofkin.component';
import { AcademicHistoryComponent } from "../../widgets/admission/forms/academichistory/academichistory.component";
import { UploadFormComponent } from "../../widgets/admission/forms/uploadform/uploadform.component";
import { ApplicationSummaryComponent } from "../../widgets/admission/forms/applicationsummary/applicationsummary.component";

@Component({
  selector: 'app-admissionform',
  standalone: true,
  templateUrl: './admissionform.component.html',
  styleUrl: './admissionform.component.scss',
  imports: [
    TraceabilityModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    StepperModule,
    PersonalDetailsComponent,
    NextOfKinComponent,
    AcademicHistoryComponent,
    UploadFormComponent,
    ApplicationSummaryComponent
],
  providers: [MessageService]
})
export class AdmissionFormComponent implements OnInit {

  app_no: string = "";
  visible: boolean = false;
  sidebarVisible = false;

  // Loading states for each step
  isLoadingPersonal: boolean = false;
  isLoadingNextOfKin: boolean = false;
  isLoadingAcademic: boolean = false;
  isLoadingDocuments: boolean = false;
  isSubmittingApplication: boolean = false;
  isEditLocked: boolean = false;
  hasComplianceIssued: boolean = false;
  complianceDirective: string = '';

  _widgetService = inject(WidgetsService);
  _formStepService = inject(FormService);
  _appservice = inject(ApplicationService);
  _preRegData = inject(RegStoreService);
  cd = inject(ChangeDetectorRef);
  router = inject(Router);
  route = inject(ActivatedRoute);
  messageService = inject(MessageService);
  authSessionStore = inject(AuthSessionStore);

  formStepStatus: formstepDTO = {
    academicValid: false,
    docUploadValid: false,
    nextofkinValid: false,
    personalinfoValid: false
  };
  savedStepStatus: formstepDTO = {
    academicValid: false,
    docUploadValid: false,
    nextofkinValid: false,
    personalinfoValid: false
  };

  _personalFormData: TPersonalDetailDTO | null = null;
  _nextofkinFormData: TNextOfKinDTO | null = null;
  _academicHistoryFormData: TAcademicHistory[] | null = null;
  _olevelFormData: TOLevelResult[] | null = null;
  _utmeResultFormData: TUtmeResultPayload | null = null;
  _uploadFileFormData: TUploadFile | null = null;

  _states: States[] | undefined;
  _lgas: LGA[] | undefined;

  activeStepIndex: number = 1;

  constructor() {
    this._widgetService.sidebarState$.subscribe((state: sidebarStateDTO) => {
      this.sidebarVisible = state.isvisible;
    });

    this._formStepService.formsteps$.subscribe((step: formstepDTO) => {
      this.formStepStatus = step;
    });

    this._formStepService.savedFormSteps$.subscribe((step: formstepDTO) => {
      this.savedStepStatus = step;
    });

    this._formStepService.personalform$.subscribe((data: TPersonalDetailDTO | null) => {
      if (data != null) {
        this._personalFormData = data;
      }
    });

    this._formStepService.nextofkinform$.subscribe((data: TNextOfKinDTO | null) => {
      if (data != null) {
        this._nextofkinFormData = data;
      }
    });

    this._formStepService.uploadFile$.subscribe((data: TUploadFile | null) => {
      if (data != null) {
        this._uploadFileFormData = data;
      }
    });

    this._formStepService.academicHistory$.subscribe((data: TAcademicHistory[] | null) => {
      if (data != null) {
        this._academicHistoryFormData = data;
      }
    });

    this._formStepService.olevelResult$.subscribe((data: TOLevelResult[] | null) => {
      if (data != null) {
        this._olevelFormData = data;
      }
    });

    this._formStepService.utmeResult$.subscribe((data: TUtmeResultPayload | null) => {
      if (data != null) {
        this._utmeResultFormData = data;
      }
    });
  }

  ngOnInit(): void {
    const requestedStep = Number(this.route.snapshot.queryParamMap.get('step'));

    this._appservice.registrationData().subscribe({
      next: (data) => {
        this._preRegData.setPreRegData(data);
      },
      error: () => {}
    });

    this._appservice.countries().subscribe({
      next: (data) => {
        this._preRegData.setCountryData(data);
      },
      error: () => {}
    });

    this._appservice.states().subscribe({
      next: (data) => {
        this._preRegData.setStateData(data);
      },
      error: () => {}
    });

    this._preRegData.stateData$.subscribe(data => {
      if (data != undefined) {
        this._states = data.data;
      }
    });

    this._preRegData.lgaData$.subscribe(data => {
      if (data != undefined) {
        this._lgas = data;
      }
    });

    const appNo = this.authSessionStore.applicationNo() || '';
    if (!appNo) {
      return;
    }

    this._appservice.registrantData(appNo).subscribe({
      next: (data: RegistrantDataDTO) => {
        this._preRegData.setRegData(data);
        this.computeEditLockState(data);
        this.hydrateFormStateFromRegistrantData(data);
        this.setInitialStep(requestedStep);
      },
      error: () => {
        this.setInitialStep(requestedStep);
      },
    });
  }

  continueToStep(currentStep: number, nextStep: number): void {
    this.markStepAsSaved(currentStep);
    this.activateStep(nextStep);
  }

  activateStep(step: number) {
    if (!this.canNavigateToStep(step)) {
      return;
    }
    this.activeStepIndex = step;
  }

  canNavigateToStep(step: number): boolean {
    if (this.hasComplianceIssued) {
      return true;
    }

    switch (step) {
      case 1:
        return true;
      case 2:
        return this.savedStepStatus.personalinfoValid;
      case 3:
        return this.savedStepStatus.nextofkinValid;
      case 4:
        return this.savedStepStatus.academicValid;
      case 5:
        return this.savedStepStatus.docUploadValid;
      default:
        return false;
    }
  }

  isReadyToSubmit(): boolean {
    return this.formStepStatus.personalinfoValid
      && this.formStepStatus.nextofkinValid
      && this.formStepStatus.academicValid
      && this.formStepStatus.docUploadValid;
  }

  private setInitialStep(requestedStep: number): void {
    if (Number.isFinite(requestedStep) && requestedStep >= 1 && requestedStep <= 5) {
      this.activateStep(requestedStep);
      return;
    }
    this.activeStepIndex = this.resolveResumeStep(this.savedStepStatus);
  }

  private resolveResumeStep(status: formstepDTO): number {
    if (!status.personalinfoValid) {
      return 1;
    }
    if (!status.nextofkinValid) {
      return 2;
    }
    if (!status.academicValid) {
      return 3;
    }
    if (!status.docUploadValid) {
      return 4;
    }
    return 5;
  }

  private hydrateFormStateFromRegistrantData(payload: RegistrantDataDTO): void {
    const data = payload?.data;
    if (!data) {
      return;
    }

    const personalDone = this.hasRegistrantValue(data.marital_status)
      && this.hasRegistrantValue(data.gender)
      && this.hasRegistrantValue(data.dob)
      && this.hasRegistrantValue(data.nationality)
      && this.hasRegistrantValue(data.state_of_origin)
      && this.hasRegistrantValue(data.lga);

    const nextOfKinDone = !!data.primary_parent_or_guardian
      && this.hasRegistrantValue(data.primary_parent_or_guardian.first_name)
      && this.hasRegistrantValue(data.primary_parent_or_guardian.last_name)
      && this.hasRegistrantValue(data.primary_parent_or_guardian.phone_number);

    const academicDone = Array.isArray(data.academic_history) && data.academic_history.length > 0;

    const docsDone = !!data.certificate_of_birth?.file_url
      && !!data.passport_photo?.file_url
      && !!data.utme_result?.file?.file_url
      && !!data.certificate_of_origin?.file_url
      && !!data.o_level_result?.[0]?.file?.file_url;

    const inferredStepStatus: formstepDTO = {
      personalinfoValid: personalDone,
      nextofkinValid: nextOfKinDone,
      academicValid: academicDone,
      docUploadValid: docsDone,
    };
    this.formStepStatus = inferredStepStatus;
    this._formStepService.setFormSteps(inferredStepStatus);
    this.savedStepStatus = inferredStepStatus;
    this._formStepService.setSavedFormSteps(inferredStepStatus);
  }

  private markStepAsSaved(step: number): void {
    const nextSavedStatus: formstepDTO = {
      ...this.savedStepStatus,
      personalinfoValid: step === 1 ? true : this.savedStepStatus.personalinfoValid,
      nextofkinValid: step === 2 ? true : this.savedStepStatus.nextofkinValid,
      academicValid: step === 3 ? true : this.savedStepStatus.academicValid,
      docUploadValid: step === 4 ? true : this.savedStepStatus.docUploadValid,
    };
    this.savedStepStatus = nextSavedStatus;
    this._formStepService.setSavedFormSteps(nextSavedStatus);
  }

  private hasRegistrantValue(value: unknown): boolean {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
  }

  private canEditApplication(): boolean {
    return !this.isEditLocked;
  }

  private ensureCanEditOrReject(): Promise<void> | null {
    if (this.canEditApplication()) {
      return null;
    }
    const msg = 'Application can only be edited when the status is pending or compliance is issued.';
    this.showError('Application Locked', msg);
    return Promise.reject(msg);
  }

  private computeEditLockState(payload: RegistrantDataDTO): void {
    const data = payload?.data;
    if (!data) {
      this.isEditLocked = false;
      this.complianceDirective = '';
      return;
    }

    const approvalStatus = normalizeApplicationStatusKey(data.approval_status);
    const directive = data.compliance_directive ?? '';
    this.complianceDirective = directive;
    const complianceIssued = approvalStatus === 'compliance_required';
    const pendingApproval = approvalStatus === 'pending';
    this.hasComplianceIssued = complianceIssued;

    this.isEditLocked = !(pendingApproval || complianceIssued);
    this._formStepService.setApplicationEditable(!this.isEditLocked);
  }

  showSuccess(summary: string, detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: summary,
      detail: detail,
      life: 3000
    });
  }

  showError(summary: string, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail,
      life: 5000
    });
  }

  buildOLevelDetailObj() {
    let _allAcHistory: TAcademicHistory[] = [];
    if (this._academicHistoryFormData != null) {
      this._academicHistoryFormData.forEach((val, i) => {
        if (val.institution != "") {
          _allAcHistory.push({
            institution: val.institution,
            certificate_type: val.certificate_type,
            from_date: val.from_date,
            to_date: val.to_date
          });
        }
      });
    }
    return _allAcHistory;
  }

  buildAcademicDetailObj() {
    let _allOlevel: TOLevelResult[] = [];
    if (this._olevelFormData != null) {
      this._olevelFormData.forEach((val, i) => {
        _allOlevel.push({
          subjects: val.subjects,
          name: val.name
        });
      });
    }
    return _allOlevel;
  }

  buildUtmeResultObj() {
    if (this._utmeResultFormData != null) {
      return {
        utme_reg_no: this._utmeResultFormData.utme_reg_no || '',
        score: this._utmeResultFormData.score
      };
    }
    return {
      utme_reg_no: '',
      score: null
    };
  }

  buildDocumentUploadObj() {
    if (this._uploadFileFormData != null) {
      return this._uploadFileFormData;
    }
    return;
  }

  private async buildPersonalDetailObj(registrant: RegistrantData | undefined): Promise<Record<string, unknown> | undefined> {
    if (this._personalFormData != null) {
      const stateOfOrigin = this.resolveStateName(this._personalFormData.stateOfOrigin, registrant?.state_of_origin);
      const lga = await this.resolveLgaName(
        this._personalFormData.stateOfOrigin,
        this._personalFormData.localGovernment,
        registrant?.lga
      );
      let _caddress: Address = {
        address: `${this._personalFormData.houseNumber}, ${this._personalFormData.streetName}, ${this._personalFormData.areaTown}`,
        street_name: this._personalFormData.streetName,
        land_mark: this._personalFormData.landmark,
        city: this._personalFormData.areaTown,
        lga_id: this._personalFormData.localGovernment
      };
      let _raddress: Address = {
        address: `${this._personalFormData.houseNumber}, ${this._personalFormData.streetName}, ${this._personalFormData.areaTown}`,
        street_name: this._personalFormData.streetName,
        land_mark: this._personalFormData.landmark,
        city: this._personalFormData.areaTown,
        lga_id: this._personalFormData.residentialLocalGovernment
      };
      let _personalDetail: any = {
        marital_status: this._personalFormData.maritalStatus,
        disability: this._personalFormData.disability == "Yes" ? `${this._personalFormData.disability}, ${this._personalFormData.disabilityDetails}` : `${this._personalFormData.disability}`,
        residential_address: _raddress,
        correspondence_address: _caddress,
        nationality: this._personalFormData.nationality,
        dob: this._personalFormData.dateOfBirth ? this._personalFormData.dateOfBirth.toISOString().split('T')[0] : '',
        gender: this._personalFormData.gender,
        lga,
        state_of_origin: stateOfOrigin,
      };
      return _personalDetail;
    }

    return undefined;
  }

  private async buildNextOfKinDetailObj(registrant: RegistrantData | undefined): Promise<Record<string, unknown> | undefined> {
    if (this._nextofkinFormData != null) {
      const nextOfKinRegistrant = registrant?.primary_parent_or_guardian;
      const stateOfOrigin = this.resolveStateName(
        this._nextofkinFormData.stateOfOrigin,
        nextOfKinRegistrant?.state_of_origin
      );
      const lga = await this.resolveLgaName(
        this._nextofkinFormData.stateOfOrigin,
        this._nextofkinFormData.localGovernment,
        nextOfKinRegistrant?.lga
      );
      let _nokDetail: any = {
        title: this._nextofkinFormData.title,
        first_name: this._nextofkinFormData.firstname,
        last_name: this._nextofkinFormData.lastname,
        email: this._nextofkinFormData.email,
        gender: this._nextofkinFormData.gender,
        phone_number: this._nextofkinFormData.phonenumber,
        occupation: this._nextofkinFormData.occupation,
        nationality: this._nextofkinFormData.nationality,
        residential_address: `${this._nextofkinFormData.houseNumber}, ${this._nextofkinFormData.streetName},${this._nextofkinFormData.landmark}, ${this._nextofkinFormData.areaTown}`,
        correspondence_address: `${this._nextofkinFormData.houseNumber}, ${this._nextofkinFormData.streetName},${this._nextofkinFormData.landmark}, ${this._nextofkinFormData.areaTown}`,
        lga,
        state_of_origin: stateOfOrigin,
      };
      return _nokDetail;
    }

    return undefined;
  }

  private resolveStateName(rawStateValue: string, fallbackStateName: string | undefined): string {
    const stateId = Number(rawStateValue);
    if (Number.isFinite(stateId)) {
      const matchedState = this._states?.find((state) => state.id === stateId);
      if (matchedState?.name) {
        return matchedState.name;
      }
    }

    return fallbackStateName ?? rawStateValue;
  }

  private async resolveLgaName(
    rawStateValue: string,
    rawLgaValue: string,
    fallbackLgaName: string | undefined
  ): Promise<string> {
    const lgaId = Number(rawLgaValue);
    if (!Number.isFinite(lgaId)) {
      return fallbackLgaName ?? rawLgaValue;
    }

    const cachedLga = this._lgas?.find((lga) => lga.id === lgaId);
    if (cachedLga?.name) {
      return cachedLga.name;
    }

    const stateId = Number(rawStateValue);
    if (Number.isFinite(stateId)) {
      const lgaResponse = await firstValueFrom(this._appservice.lgas(stateId));
      const matchedLga = lgaResponse.data.find((lga) => lga.id === lgaId);
      if (matchedLga?.name) {
        return matchedLga.name;
      }
    }

    return fallbackLgaName ?? rawLgaValue;
  }

  private extractSubmissionErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const errorPayload = error.error;
      if (typeof errorPayload === 'string' && errorPayload.trim().length > 0) {
        return errorPayload;
      }
      if (typeof errorPayload?.detail === 'string' && errorPayload.detail.trim().length > 0) {
        return errorPayload.detail;
      }
      if (typeof errorPayload?.message === 'string' && errorPayload.message.trim().length > 0) {
        return errorPayload.message;
      }
      if (Array.isArray(errorPayload?.errors) && errorPayload.errors.length > 0) {
        return String(errorPayload.errors[0]);
      }
    }

    if (error instanceof Error && error.message.trim().length > 0) {
      return error.message;
    }

    return 'Unable to submit your application right now. Please try again.';
  }

  async confirm(): Promise<void> {
    if (this.isSubmittingApplication) {
      return;
    }

    const applicantNo = this.authSessionStore.applicationNo() || '';
    if (!applicantNo) {
      this.showError('Submit Application', 'Application number is missing. Please refresh and try again.');
      return;
    }

    this.isSubmittingApplication = true;
    try {
      await this.persistDraftChanges(applicantNo);
      await firstValueFrom(this._appservice.submitApplication({ applicant_no: applicantNo }));
      this._formStepService.resetAdmissionFormState();
      this.visible = true;
      this.cd.detectChanges();
    } catch (error: unknown) {
      this.showError('Submit Application', this.extractSubmissionErrorMessage(error));
    } finally {
      this.isSubmittingApplication = false;
    }
  }

  private async persistDraftChanges(applicantNo: string): Promise<void> {
    const blocked = this.ensureCanEditOrReject();
    if (blocked) {
      await blocked;
      return;
    }

    const payload = await this.buildMergedApplicationPayload();
    if (Object.keys(payload).length === 0) {
      return;
    }

    await firstValueFrom(this._appservice.personalDetails(applicantNo, payload));
    const latestRegistrantData = await firstValueFrom(this._appservice.registrantData(applicantNo));
    this._preRegData.setRegData(latestRegistrantData);
  }

  private async buildMergedApplicationPayload(): Promise<Record<string, unknown>> {
    const payload: Record<string, unknown> = {};
    const registrant = this._preRegData.regData()?.data;
    const personalDetails = await this.buildPersonalDetailObj(registrant);
    const nextOfKinDetails = await this.buildNextOfKinDetailObj(registrant);

    if (personalDetails) {
      Object.assign(payload, personalDetails);
    }

    if (nextOfKinDetails) {
      payload['primary_parent_or_guardian'] = nextOfKinDetails;
    }

    Object.assign(payload, this.buildMergedAcademicAndDocumentPayload());

    return payload;
  }

  private buildMergedAcademicAndDocumentPayload(): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    const registrant = this._preRegData.regData()?.data;
    const hasAcademicDraft = this._academicHistoryFormData !== null
      || this._olevelFormData !== null
      || this._utmeResultFormData !== null;
    const hasUploadDraft = this._uploadFileFormData !== null;

    if (!hasAcademicDraft && !hasUploadDraft) {
      return payload;
    }

    const academicHistory = this.resolveAcademicHistoryPayload(registrant);
    if (academicHistory.length > 0) {
      payload['academic_history'] = academicHistory;
    }

    const oLevelResults = this.resolveOLevelResultPayload(registrant);
    if (oLevelResults.length > 0) {
      payload['o_level_result'] = oLevelResults;
    }

    const utmeRegNo = this.resolveUtmeRegNo(registrant);
    if (utmeRegNo.length > 0) {
      payload['utme_reg_no'] = utmeRegNo;
    }

    const utmeResult = this.resolveUtmeResultPayload(registrant);
    if (Object.keys(utmeResult).length > 0) {
      payload['utme_result'] = utmeResult;
    }

    const documentPayload = this.resolveDocumentPayload(registrant);
    Object.assign(payload, documentPayload);

    return payload;
  }

  private resolveAcademicHistoryPayload(registrant: RegistrantData | undefined): TAcademicHistory[] {
    if (this._academicHistoryFormData !== null) {
      return [...this._academicHistoryFormData];
    }

    return (registrant?.academic_history ?? []).map((item: AcademicHistory) => ({
      institution: item.institution,
      certificate_type: item.certificate_type,
      from_date: item.from_date,
      to_date: item.to_date
    }));
  }

  private resolveOLevelResultPayload(registrant: RegistrantData | undefined): TOLevelResult[] {
    const oLevelResults = this._olevelFormData !== null
      ? this._olevelFormData.map((item) => ({ ...item }))
      : (registrant?.o_level_result ?? []).map((item: OLevelResult) => ({
          name: item.name,
          subjects: item.subjects,
          file: item.file
        }));

    const uploadedOLevelFile = this._uploadFileFormData?.olevels?.[0] ?? registrant?.o_level_result?.[0]?.file;
    if (uploadedOLevelFile && oLevelResults[0]) {
      oLevelResults[0].file = uploadedOLevelFile;
    }

    return oLevelResults;
  }

  private resolveUtmeRegNo(registrant: RegistrantData | undefined): string {
    const utmeRegNo = this._utmeResultFormData?.utme_reg_no ?? registrant?.utme_reg_no ?? '';
    return utmeRegNo.trim();
  }

  private resolveUtmeResultPayload(registrant: RegistrantData | undefined): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    const utmeScore = this._utmeResultFormData?.score ?? registrant?.utme_result?.score ?? null;
    const utmeFile = this._uploadFileFormData?.utme ?? registrant?.utme_result?.file;

    if (utmeFile?.file_url) {
      payload['file'] = utmeFile;
    }

    if (utmeScore !== null) {
      payload['score'] = utmeScore;
    }

    return payload;
  }

  private resolveDocumentPayload(registrant: RegistrantData | undefined): Record<string, unknown> {
    if (this._uploadFileFormData === null) {
      return {};
    }

    const payload: Record<string, unknown> = {};
    const certificateOfBirth = this.resolveUploadedDocument(
      this._uploadFileFormData.certificateofbirth,
      registrant?.certificate_of_birth
    );
    const passportPhoto = this.resolveUploadedDocument(
      this._uploadFileFormData.passport,
      registrant?.passport_photo
    );
    const certificateOfOrigin = this.resolveUploadedDocument(
      this._uploadFileFormData.origin,
      registrant?.certificate_of_origin
    );

    if (certificateOfBirth?.file_url) {
      payload['certificate_of_birth'] = certificateOfBirth;
    }

    if (passportPhoto?.file_url) {
      payload['passport_photo'] = passportPhoto;
    }

    if (certificateOfOrigin?.file_url) {
      payload['certificate_of_origin'] = certificateOfOrigin;
    }

    return payload;
  }

  private resolveUploadedDocument(
    draftDocument: CertificateOfBirth | undefined,
    backendDocument: CertificateOfBirth | undefined
  ): CertificateOfBirth | undefined {
    if (draftDocument?.file_url) {
      return draftDocument;
    }

    if (backendDocument?.file_url) {
      return backendDocument;
    }

    return undefined;
  }

  done() {
    this.visible = false;
    setTimeout(() => {
      this.router.navigateByUrl("/pages/dashboard");
    }, 1500);
  }
}
