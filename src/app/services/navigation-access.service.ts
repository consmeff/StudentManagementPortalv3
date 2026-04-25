import { Injectable, inject } from '@angular/core';
import { AuthSessionStore } from '../store/auth-session.store';
import { Router } from '@angular/router';

export type ProtectedPageFeature = 'dashboard' | 'profile' | 'payment' | 'admissionform' | 'summarypage' | 'courses';

@Injectable({ providedIn: 'root' })
export class NavigationAccessService {
  private readonly authSessionStore = inject(AuthSessionStore);
  private readonly router = inject(Router);

  canAccess(feature: ProtectedPageFeature): boolean {
    switch (feature) {
      case 'dashboard':
      case 'profile':
      case 'admissionform':
      case 'summarypage':
      case 'courses':
        return true;
      case 'payment':
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

    if (normalizedStatus.includes('unpaid') || normalizedStatus.includes('no payment')) {
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
}
