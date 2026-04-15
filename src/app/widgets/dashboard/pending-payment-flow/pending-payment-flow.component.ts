import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TraceabilityModule } from '../../../shared/traceability.module';
import { ApplicationService } from '../../../services/application.service';
import { Datum, OpenApplicationDTO } from '../../../data/application/admission.dto';
import { APPLICATION_GUIDELINE_CONTENT } from '../../../data/dashboard/application-guideline.data';
import { AuthSessionStore } from '../../../store/auth-session.store';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-pending-payment-flow',
  standalone: true,
  imports: [CommonModule, TraceabilityModule],
  templateUrl: './pending-payment-flow.component.html',
  styleUrl: './pending-payment-flow.component.scss',
  providers: [MessageService],
})
export class PendingPaymentFlowComponent implements OnInit {
  private readonly appService = inject(ApplicationService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly authSessionStore = inject(AuthSessionStore);

  readonly guidelineContent = APPLICATION_GUIDELINE_CONTENT;
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

  ngOnInit(): void {
    this.dashboardName.set(this.authSessionStore.name() || sessionStorage.getItem('user_name') || 'Applicant');
    this.dashboardPaymentStatus.set(
      this.authSessionStore.paymentStatus() || sessionStorage.getItem('PAYMENT_STATUS') || 'Pending'
    );
  }

  get isPaymentPending(): boolean {
    return this.dashboardPaymentStatus().toLowerCase() !== 'paid';
  }

  async continueFlow(): Promise<void> {
    if (!this.isPaymentPending) {
      this.router.navigateByUrl('/pages/admissionform');
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
        this.loadingError.set('No open applications are currently available.');
      }
    } catch {
      this.loadingError.set('Unable to load open applications. Please try again.');
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
    this.guidelinesAccepted.set(false);
    this.showGuidelineDialog.set(true);
  }

  async proceedToPayment(): Promise<void> {
    if (!this.guidelinesAccepted()) {
      return;
    }
    if (!this.selectedApplicationId()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Programme',
        detail: 'Please select a programme before continuing.',
      });
      return;
    }

    this.initializingApplication.set(true);
    try {
      const initResp = await firstValueFrom(
        this.appService.initializeApplication({ application_id: this.selectedApplicationId() })
      );
      const applicationNo = initResp?.data?.application_no ?? '';

      if (!applicationNo) {
        this.messageService.add({
          severity: 'error',
          summary: 'Application',
          detail: 'Unable to continue because application number was not returned.',
        });
        return;
      }

      sessionStorage.setItem('APP_NO', applicationNo);
      this.showGuidelineDialog.set(false);
      this.router.navigateByUrl('/pages/payment');
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Application',
        detail: 'Unable to initialize your application for payment. Please try again.',
      });
    } finally {
      this.initializingApplication.set(false);
    }
  }
}
