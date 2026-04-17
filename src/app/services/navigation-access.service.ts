import { Injectable } from '@angular/core';

export type ProtectedPageFeature = 'dashboard' | 'profile' | 'payment' | 'admissionform' | 'summarypage';

@Injectable({ providedIn: 'root' })
export class NavigationAccessService {
  canAccess(feature: ProtectedPageFeature): boolean {
    switch (feature) {
      case 'dashboard':
      case 'profile':
      case 'payment':
      case 'admissionform':
      case 'summarypage':
        return true;
      default:
        return false;
    }
  }
}
