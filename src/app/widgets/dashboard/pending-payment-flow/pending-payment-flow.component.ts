import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TraceabilityModule } from '../../../shared/traceability.module';
import { ApplicationService } from '../../../services/application.service';
import { Datum, OpenApplicationDTO } from '../../../data/application/admission.dto';
import { APPLICATION_GUIDELINE_CONTENT } from '../../../data/dashboard/application-guideline.data';
import { AuthSessionStore } from '../../../store/auth-session.store';
import { firstValueFrom } from 'rxjs';
import { ApplicationGuidelineModalComponent } from '../application-guideline-modal/application-guideline-modal.component';
import { PaymentWorkflowService } from '../../../services/payment-workflow.service';
import { RegistrantData } from '../../../data/application/registrantdatadto';
import {
  ACTION_LABELS,
  HERO_CONTENT,
  ROUTES,
  STATUS_MATCHERS,
  STEP_CONTENT,
  UI_COPY,
} from '../../../constants/dashboard/pending-payment-flow.constants';

type StepStatus = 'completed' | 'active' | 'inactive';

interface ApplicationStep {
  index: number;
  title: string;
  description: string;
  status: StepStatus;
  actionLabel?: string;
}

interface CompletedApplicationDetails {
  applicationNo: string;
  preferredProgramme: string;
  applicationDate: string;
}

@Component({
  selector: 'app-pending-payment-flow',
  standalone: true,
  imports: [CommonModule, TraceabilityModule, ApplicationGuidelineModalComponent],
  templateUrl: './pending-payment-flow.component.html',
  styleUrl: './pending-payment-flow.component.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingPaymentFlowComponent implements OnInit {
  private readonly appService = inject(ApplicationService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly authSessionStore = inject(AuthSessionStore);
  private readonly paymentWorkflow = inject(PaymentWorkflowService);

  readonly guidelineContent = APPLICATION_GUIDELINE_CONTENT;
  readonly actionLabels = ACTION_LABELS;
  readonly loadingApplications = signal(false);
  readonly initializingApplication = signal(false);
  readonly loadingError = signal('');
  readonly applicationOptions = signal<Datum[]>([]);
  readonly selectedApplicationId = signal<number | null>(null);
  readonly showProgrammeDialog = signal(false);
  readonly showGuidelineDialog = signal(false);
  readonly guidelinesAccepted = signal(false);

  readonly dashboardName = signal('');
  readonly dashboardPaymentStatus = signal('');
  readonly registrantData = signal<RegistrantData | null>(null);
  readonly completedApplication = signal<CompletedApplicationDetails | null>(null);
  readonly applicantPhotoUrl = signal('');
  readonly isApplicationCompleted = signal(false);
  readonly isPaymentPending = signal(true);
  readonly progressPercent = signal(20);
  readonly heroTitle = signal<string>(HERO_CONTENT.pending.title);
  readonly heroDescription = signal<string>(HERO_CONTENT.pending.description);
  readonly primaryActionLabel = signal<string>(HERO_CONTENT.pending.actionLabel);
  readonly applicationSteps = signal<ApplicationStep[]>([]);

  ngOnInit(): void {
    this.dashboardName.set(this.authSessionStore.name() || UI_COPY.defaultApplicantName);
    this.dashboardPaymentStatus.set(
      this.authSessionStore.paymentStatus() || UI_COPY.defaultPaymentStatus
    );
    this.recomputeDashboardState();
    void this.loadRegistrantSnapshot();
  }

  onPrimaryAction(): void {
    if (this.isApplicationCompleted()) {
      this.viewApplicationSummary();
      return;
    }
    if (this.isPaymentPending()) {
      this.continueFlow();
      return;
    }
    this.navigateToRelevantFormStep();
  }

  onStepAction(step: ApplicationStep): void {
    if (!step.actionLabel) {
      return;
    }
    if (step.index === 2) {
      this.continueFlow();
      return;
    }
    if (step.index === 4) {
      this.navigateToFormStep(4);
      return;
    }
    this.navigateToRelevantFormStep();
  }

  viewApplicationSummary(): void {
    this.router.navigateByUrl('/pages/summarypage');
  }

  async continueFlow(): Promise<void> {
    if (!this.isPaymentPending()) {
      this.router.navigateByUrl(ROUTES.admissionForm);
      return;
    }

    await this.loadOpenApplications();
    if (this.applicationOptions().length > 0) {
      this.showProgrammeDialog.set(true);
    }
  }

  async loadOpenApplications(): Promise<void> {
    this.loadingApplications.set(true);
    this.loadingError.set('');
    try {
      const response = (await firstValueFrom(this.appService.openApplications())) as OpenApplicationDTO;
      const options = response?.data ?? [];
      this.applicationOptions.set(options);

      if (options.length === 0) {
        this.loadingError.set(UI_COPY.noOpenApplications);
      }
    } catch {
      this.loadingError.set(UI_COPY.loadApplicationsError);
      this.messageService.add({
        severity: 'error',
        summary: 'Applications',
        detail: 'Failed to load open applications.',
      });
    } finally {
      this.loadingApplications.set(false);
    }
  }

  selectApplication(id: number): void {
    this.selectedApplicationId.set(id);
  }

  async proceedFromProgramme(): Promise<void> {
    if (!this.selectedApplicationId()) {
      return;
    }
    this.showProgrammeDialog.set(false);
    this.guidelinesAccepted.set(true);
    this.showGuidelineDialog.set(true);
  }

  async proceedToPayment(): Promise<void> {
    if (!this.selectedApplicationId()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Programme',
        detail: UI_COPY.selectProgrammeError,
      });
      return;
    }

    this.initializingApplication.set(true);
    try {
      const selectedOption = this.applicationOptions().find((item) => item.id === this.selectedApplicationId());
      const departmentId = selectedOption?.department?.id ?? selectedOption?.program?.id ?? 0;
      const initResp = await firstValueFrom(
        this.appService.initializeApplication({
          application_id: this.selectedApplicationId(),
          department_id: departmentId,
        })
      );
      const applicationNo = initResp?.data?.application_no ?? '';

      if (!applicationNo) {
        this.messageService.add({
          severity: 'error',
          summary: 'Application',
          detail: UI_COPY.missingApplicationNoError,
        });
        return;
      }

      this.authSessionStore.setApplicationNo(applicationNo);
      // this.dashboardPaymentStatus.set('Pending');
      this.recomputeDashboardState();
      this.showGuidelineDialog.set(false);
      await this.paymentWorkflow.startForApplication(applicationNo, {
        onProcessingChange: (state) => this.initializingApplication.set(state),
        onVerifyingChange: (state) => this.initializingApplication.set(state),
        onSuccess: (title, message) => this.messageService.add({ severity: 'success', summary: title, detail: message }),
        onError: (title, message) => this.messageService.add({ severity: 'error', summary: title, detail: message }),
        onWarning: (title, message) => this.messageService.add({ severity: 'warn', summary: title, detail: message }),
      });
      await this.loadRegistrantSnapshot();
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Application',
        detail: UI_COPY.initializeApplicationError,
      });
    } finally {
      this.initializingApplication.set(false);
    }
  }

  private async loadRegistrantSnapshot(): Promise<void> {
    const appNo = this.authSessionStore.applicationNo() || '';
    if (!appNo) {
      return;
    }

    try {
      const response = await firstValueFrom(this.appService.registratantData(appNo));
      const data = response?.data ?? null;
      this.registrantData.set(data);

      if (data?.payment_status) {
        const incomingStatus = data.payment_status;
        const currentStatus = this.getEffectivePaymentStatus();
        const shouldApplyIncomingStatus = !this.isPaymentCompletedValue(currentStatus)
          || this.isPaymentCompletedValue(incomingStatus);

        if (shouldApplyIncomingStatus) {
          this.dashboardPaymentStatus.set(incomingStatus);
          this.authSessionStore.setPaymentStatus(incomingStatus);
        }
      }
      if (data?.first_name || data?.last_name) {
        const composedName = `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim();
        if (composedName) {
          this.dashboardName.set(composedName);
        }
      }
    } catch {
      // Keep dashboard responsive even when snapshot endpoint fails.
    } finally {
      this.recomputeDashboardState();
    }
  }

  private isPaymentCompleted(): boolean {
    return this.isPaymentCompletedValue(this.getEffectivePaymentStatus());
  }

  private hasValue(value: unknown): boolean {
    return typeof value === 'string' ? value.trim().length > 0 : !!value;
  }

  onProgrammeDialogVisibilityChange(visible: boolean): void {
    this.showProgrammeDialog.set(visible);
  }

  onGuidelineDialogVisibilityChange(visible: boolean): void {
    this.showGuidelineDialog.set(visible);
  }

  onGuidelineAcceptedChange(accepted: boolean): void {
    this.guidelinesAccepted.set(accepted);
  }

  private getEffectivePaymentStatus(): string {
    console.log("first status rendering:",this.authSessionStore.paymentStatus())
    return this.authSessionStore.paymentStatus();
  }

  private isPaymentCompletedValue(status: string): boolean {
    const normalized = (status || '').toLowerCase().trim();
    console.log("This is the staus:", normalized)
    if (!normalized) {
      return false;
    }

    if (STATUS_MATCHERS.paymentNegativeKeywords.some((keyword) => normalized.includes(keyword))) {
      return false;
    }

    return STATUS_MATCHERS.paymentPositiveKeywords.some((keyword) => normalized.includes(keyword));
  }

  private computeIsFormSectionCompleted(data: RegistrantData | null): boolean {
    if (!data) {
      return false;
    }

    const personalComplete = this.hasValue(data.marital_status)
      && this.hasValue(data.gender)
      && this.hasValue(data.dob)
      && this.hasValue(data.nationality)
      && this.hasValue(data.state_of_origin)
      && this.hasValue(data.lga);

    const kinComplete = !!data.primary_parent_or_guardian
      && this.hasValue(data.primary_parent_or_guardian.first_name)
      && this.hasValue(data.primary_parent_or_guardian.last_name)
      && this.hasValue(data.primary_parent_or_guardian.phone_number);

    const academicComplete = Array.isArray(data.academic_history) && data.academic_history.length > 0;

    return personalComplete && kinComplete && academicComplete;
  }

  private computeIsPersonalSectionCompleted(data: RegistrantData | null): boolean {
    if (!data) {
      return false;
    }

    return this.hasValue(data.marital_status)
      && this.hasValue(data.gender)
      && this.hasValue(data.dob)
      && this.hasValue(data.nationality)
      && this.hasValue(data.state_of_origin)
      && this.hasValue(data.lga);
  }

  private computeIsKinSectionCompleted(data: RegistrantData | null): boolean {
    if (!data?.primary_parent_or_guardian) {
      return false;
    }

    return this.hasValue(data.primary_parent_or_guardian.first_name)
      && this.hasValue(data.primary_parent_or_guardian.last_name)
      && this.hasValue(data.primary_parent_or_guardian.phone_number);
  }

  private computeIsAcademicSectionCompleted(data: RegistrantData | null): boolean {
    return Array.isArray(data?.academic_history) && data.academic_history.length > 0;
  }

  private computeAreDocumentsUploaded(data: RegistrantData | null): boolean {
    if (!data) {
      return false;
    }

    return !!data.passport_photo?.file_url
      && !!data.certificate_of_birth?.file_url
      && !!data.o_level_result?.length;
  }

  private computeIsSubmissionCompleted(data: RegistrantData | null): boolean {
    if (!data) {
      return false;
    }

    const approval = (data.approval_status || '').toLowerCase();
    return (STATUS_MATCHERS.submissionCompleted as readonly string[]).includes(approval);
  }

  private navigateToRelevantFormStep(): void {
    const registrant = this.registrantData();
    const personalDone = this.computeIsPersonalSectionCompleted(registrant);
    const kinDone = this.computeIsKinSectionCompleted(registrant);
    const academicDone = this.computeIsAcademicSectionCompleted(registrant);
    const docsDone = this.computeAreDocumentsUploaded(registrant);

    if (!personalDone) {
      this.navigateToFormStep(1);
      return;
    }
    if (!kinDone) {
      this.navigateToFormStep(2);
      return;
    }
    if (!academicDone) {
      this.navigateToFormStep(3);
      return;
    }
    if (!docsDone) {
      this.navigateToFormStep(4);
      return;
    }

    this.navigateToFormStep(5);
  }

  private navigateToFormStep(step: number): void {
    this.router.navigate([ROUTES.admissionForm], {
      queryParams: { step },
    });
  }

  private recomputeDashboardState(): void {
    const registrant = this.registrantData();
    const paymentDone = this.isPaymentCompleted();
    const formDone = this.computeIsFormSectionCompleted(registrant);
    const docsDone = this.computeAreDocumentsUploaded(registrant);
    const submitDone = this.computeIsSubmissionCompleted(registrant);
    this.isApplicationCompleted.set(submitDone);

    this.completedApplication.set(
      registrant
        ? {
            applicationNo: registrant.application_no || '—',
            preferredProgramme: registrant.department?.name || registrant.program?.name || '—',
            applicationDate: this.formatDisplayDate(registrant.created_at),
          }
        : null
    );
    this.applicantPhotoUrl.set(registrant?.passport_photo?.file_url || '');

    const steps: ApplicationStep[] = [
      {
        index: 1,
        title: STEP_CONTENT.createAccount.title,
        description: STEP_CONTENT.createAccount.description,
        status: 'completed',
      },
      {
        index: 2,
        title: STEP_CONTENT.chooseCourseAndPay.title,
        description: paymentDone
          ? STEP_CONTENT.chooseCourseAndPay.completedDescription
          : STEP_CONTENT.chooseCourseAndPay.pendingDescription,
        status: paymentDone ? 'completed' : 'active',
        actionLabel: paymentDone ? undefined : ACTION_LABELS.continueApplication,
      },
      {
        index: 3,
        title: STEP_CONTENT.fillApplicationForm.title,
        description: STEP_CONTENT.fillApplicationForm.description,
        status: !paymentDone ? 'inactive' : formDone ? 'completed' : 'active',
        actionLabel: paymentDone && !formDone ? ACTION_LABELS.continueToForm : undefined,
      },
      {
        index: 4,
        title: STEP_CONTENT.uploadDocuments.title,
        description: STEP_CONTENT.uploadDocuments.description,
        status: !formDone ? 'inactive' : docsDone ? 'completed' : 'active',
        actionLabel: formDone && !docsDone ? ACTION_LABELS.continueToForm : undefined,
      },
      {
        index: 5,
        title: STEP_CONTENT.submitApplication.title,
        description: STEP_CONTENT.submitApplication.description,
        status: !docsDone ? 'inactive' : submitDone ? 'completed' : 'active',
      },
    ];

    const completedSteps = steps.filter((step) => step.status === 'completed').length;
    this.applicationSteps.set(steps);
    this.progressPercent.set(submitDone ? 100 : Math.max(20, Math.min(100, completedSteps * 20)));

    const pending = !paymentDone;
    this.isPaymentPending.set(pending);
    if (pending) {
      this.heroTitle.set(HERO_CONTENT.pending.title);
      this.heroDescription.set(HERO_CONTENT.pending.description);
      this.primaryActionLabel.set(HERO_CONTENT.pending.actionLabel);
      return;
    }

    if (submitDone) {
      this.heroTitle.set('Awaiting Admission');
      this.heroDescription.set('You have successfully completed your application. Now awaiting admission decision.');
      this.primaryActionLabel.set('View Application Summary');
      return;
    }

    this.heroTitle.set(HERO_CONTENT.paid.title);
    this.heroDescription.set(HERO_CONTENT.paid.description);
    this.primaryActionLabel.set(HERO_CONTENT.paid.actionLabel);
  }

  private formatDisplayDate(value: string | Date | undefined): string {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }
    return date.toLocaleDateString('en-GB');
  }
}
