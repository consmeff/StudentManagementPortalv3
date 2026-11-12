import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AdmittedFlowService } from '../../admitted-flow.service';
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { StatusIndicatorComponent } from '../../../../shared/components/status-indicator/status-indicator.component';
import { StudentProfileDetailsComponent } from '../../../../shared/components/student-profile-details/student-profile-details.component';
import {
  ADMITTED_PROFILE_PAGE_COPY,
  ADMITTED_PROFILE_TAB,
  ADMITTED_PROFILE_TABS,
  FLAGGED_ADMISSION_DOCUMENTS_COPY,
  SUBMIT_VERIFICATION_LABELS
} from '../../../../constants/admitted-profile.constants';
import { AdmittedProfileTab } from '../../../../constants/admitted-profile.types';

@Component({
  selector: 'app-admitted-profile',
  standalone: true,
  imports: [CommonModule, TraceabilityModule, ButtonComponent, StatusIndicatorComponent, StudentProfileDetailsComponent],
  providers: [MessageService],
  templateUrl: './admitted-profile.component.html',
  styleUrl: './admitted-profile.component.scss'
})
export class AdmittedProfileComponent implements OnInit {
  readonly tabs = ADMITTED_PROFILE_TABS;

  readonly tabIds = ADMITTED_PROFILE_TAB;

  readonly pageCopy = ADMITTED_PROFILE_PAGE_COPY;

  readonly activeTab = signal<AdmittedProfileTab>(ADMITTED_PROFILE_TAB.documents);

  readonly flaggedDocumentsCopy = FLAGGED_ADMISSION_DOCUMENTS_COPY;

  readonly submitVerificationLabel = computed(() => {
    if (this.flow.submittingProfileDocuments()) {
      return SUBMIT_VERIFICATION_LABELS.submitting;
    }
    const hasSubmittedThisVisit = this.flow.sessionSubmittedDocumentSignature() !== null;
    if (this.flow.isAdmissionDocumentsFlagged() && !hasSubmittedThisVisit) {
      return SUBMIT_VERIFICATION_LABELS.resubmit;
    }
    if (this.flow.areProfileDocumentsAlreadySubmitted()) {
      return SUBMIT_VERIFICATION_LABELS.submitted;
    }
    return SUBMIT_VERIFICATION_LABELS.idle;
  });

  constructor(
    private readonly router: Router,
    readonly flow: AdmittedFlowService
  ) {}

  ngOnInit(): void {
    void this.flow.loadSnapshot().then(() => this.flow.refreshProfileVerificationState());
  }

  setTab(tab: AdmittedProfileTab): void {
    this.activeTab.set(tab);
  }

  goToPayment(): void {
    void this.router.navigateByUrl('/admitted/payment');
  }

  async onFileUpload(event: Event, documentType: 'recommendation_letter_1' | 'recommendation_letter_2' | 'testimonial'): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    await this.flow.uploadDocument(file, documentType);
  }

  removeAdmissionDocument(documentType: 'recommendation_letter_1' | 'recommendation_letter_2' | 'testimonial', event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.flow.removeAdmissionDocument(documentType);
  }

  async submitForVerification(): Promise<void> {
    await this.flow.submitProfileDocuments();
  }
}
