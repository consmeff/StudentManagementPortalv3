import { Injectable, inject } from '@angular/core';
import { AuthSessionStore } from '../store/auth-session.store';

export type ProtectedPageFeature = 'dashboard' | 'profile' | 'payment' | 'admissionform' | 'summarypage';

@Injectable({ providedIn: 'root' })
export class NavigationAccessService {
  private readonly authSessionStore = inject(AuthSessionStore);

  canAccess(feature: ProtectedPageFeature): boolean {
    switch (feature) {
      case 'dashboard':
      case 'profile':
      case 'admissionform':
      case 'summarypage':
        return true;
      case 'payment':
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
}
