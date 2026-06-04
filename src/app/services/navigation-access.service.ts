import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApplicationService } from './application.service';
import { Router } from '@angular/router';
import { AuthSessionStore } from '../store/auth-session.store';
import { UserPortalService } from './user-portal.service';

export type ProtectedPageFeature =
  | 'dashboard'
  | 'profile'
  | 'payment'
  | 'admissionform'
  | 'summarypage'
  | 'courses'
  | 'results'
  | 'cgpaTracker'
  | 'hostel';

const RETURNING_FIRST_INSTALLMENT_FEATURES: readonly ProtectedPageFeature[] = ['profile', 'courses', 'hostel'];

@Injectable({ providedIn: 'root' })
export class NavigationAccessService {
  private readonly appService = inject(ApplicationService);

  private readonly authSessionStore = inject(AuthSessionStore);

  private readonly router = inject(Router);

  private readonly userPortalService = inject(UserPortalService);

  canAccess(feature: ProtectedPageFeature): boolean {
    if (this.requiresReturningFirstInstallment(feature)) {
      return this.hasAnyPayment();
    }

    switch (feature) {
      case 'dashboard':
      case 'summarypage':
      case 'results':
      case 'cgpaTracker':
      case 'profile':
      case 'courses':
      case 'hostel':
        return true;
      case 'admissionform':
        return this.hasAnyPayment();
      case 'payment':
        if (this.isAdmittedPortalRoute()) {
          return !this.userPortalService.hasPendingAcceptanceFee();
        }
        if (!this.isNewPortalRoute()) {
          return true;
        }
        return this.hasAnyPayment();
      default:
        return false;
    }
  }

  async canAccessAsync(feature: ProtectedPageFeature): Promise<boolean> {
    if (this.canAccess(feature)) {
      return true;
    }

    if (!this.requiresReturningFirstInstallment(feature)) {
      return false;
    }

    try {
      const response = await firstValueFrom(this.appService.getStudentSchoolFeeStatus());
      const hasPaidFirstInstallment = response.payment_status.number_of_payments > 0 || response.payment_status.total_paid > 0;
      if (hasPaidFirstInstallment && !this.hasAnyPayment()) {
        this.authSessionStore.setPaymentStatus('paid');
      }
      return hasPaidFirstInstallment;
    } catch {
      return false;
    }
  }

  private hasAnyPayment(): boolean {
    const normalizedStatus = (this.authSessionStore.paymentStatus() || '').toLowerCase().trim();
    if (!normalizedStatus) {
      return false;
    }

    if (
      normalizedStatus.includes('unpaid')
      || normalizedStatus.includes('no payment')
      || normalizedStatus.includes('not paid')
      || normalizedStatus.includes('pending')
      || normalizedStatus.includes('fail')
    ) {
      return false;
    }

    return normalizedStatus.includes('paid')
      || normalizedStatus.includes('complete')
      || normalizedStatus.includes('success');
  }

  private isNewPortalRoute(): boolean {
    const firstSegment = this.router.url.split('/').filter(Boolean)[0];
    return firstSegment === 'new' || firstSegment === 'pages';
  }

  private isAdmittedPortalRoute(): boolean {
    const firstSegment = this.router.url.split('/').filter(Boolean)[0];
    return firstSegment === 'admitted';
  }

  private isReturningPortalRoute(): boolean {
    const firstSegment = this.router.url.split('/').filter(Boolean)[0];
    return firstSegment === 'returning';
  }

  private requiresReturningFirstInstallment(feature: ProtectedPageFeature): boolean {
    return this.isReturningPortalRoute() && RETURNING_FIRST_INSTALLMENT_FEATURES.includes(feature);
  }
}
