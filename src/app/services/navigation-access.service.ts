import { Injectable, inject } from '@angular/core';
import { AuthSessionStore } from '../store/auth-session.store';
import { Router } from '@angular/router';
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

@Injectable({ providedIn: 'root' })
export class NavigationAccessService {
  private readonly authSessionStore = inject(AuthSessionStore);
  private readonly router = inject(Router);
  private readonly userPortalService = inject(UserPortalService);

  canAccess(feature: ProtectedPageFeature): boolean {
    switch (feature) {
      case 'dashboard':
      case 'profile':
      case 'summarypage':
      case 'courses':
      case 'results':
      case 'cgpaTracker':
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
}
