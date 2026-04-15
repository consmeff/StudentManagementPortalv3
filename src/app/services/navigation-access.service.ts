import { Injectable } from '@angular/core';

export type ProtectedPageFeature = 'dashboard' | 'profile' | 'payment' | 'admissionform' | 'summarypage';

@Injectable({ providedIn: 'root' })
export class NavigationAccessService {
  canAccess(feature: ProtectedPageFeature): boolean {
    switch (feature) {
      case 'dashboard':
        return true;
      case 'profile':
        return false;
      case 'payment':
        return this.hasApplicationNumber();
      case 'admissionform':
      case 'summarypage':
        return this.isPaymentCompleted();
      default:
        return false;
    }
  }

  private hasApplicationNumber(): boolean {
    return !!(sessionStorage.getItem('APP_NO') || '').trim();
  }

  private isPaymentCompleted(): boolean {
    return (sessionStorage.getItem('PAYMENT_STATUS') || '') === 'Paid';
  }
}
