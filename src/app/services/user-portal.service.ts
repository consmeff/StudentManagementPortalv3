import { Injectable, inject } from '@angular/core';
import { AuthSessionStore } from '../store/auth-session.store';

export type PortalSegment = 'new' | 'admitted' | 'returning';

const ADMITTED_USER_TYPES = ['freshman'];
const RETURNING_USER_TYPES = ['student'];
const NEW_CANDIDATE_USER_TYPES = ['applicant'];
const PENDING_ACCEPTANCE_FEE_KEYWORDS = ['pending', 'unpaid', 'not paid', 'fail'];

@Injectable({ providedIn: 'root' })
export class UserPortalService {
  private readonly authSessionStore = inject(AuthSessionStore);

  portalSegment(): PortalSegment {
    const userType = (this.authSessionStore.userType() || '').toLowerCase().trim();

    if (ADMITTED_USER_TYPES.includes(userType)) {
      return 'admitted';
    }

    if (RETURNING_USER_TYPES.includes(userType)) {
      return 'returning';
    }

    if (NEW_CANDIDATE_USER_TYPES.includes(userType)) {
      return 'new';
    }

    return 'new';
  }

  isNewCandidatePortal(): boolean {
    return this.portalSegment() === 'new';
  }

  isAdmittedPortal(): boolean {
    return this.portalSegment() === 'admitted';
  }

  hasPendingAcceptanceFee(): boolean {
    const acceptanceFeeStatus = (this.authSessionStore.acceptanceFeeStatus() || '').toLowerCase().trim();
    if (!acceptanceFeeStatus) {
      return false;
    }

    return PENDING_ACCEPTANCE_FEE_KEYWORDS.some((keyword) => acceptanceFeeStatus.includes(keyword));
  }

  landingUrl(): string {
    return this.dashboardUrl();
  }

  dashboardUrl(): string {
    return `/${this.portalSegment()}/dashboard`;
  }

  buildUrl(path: string): string {
    const normalizedPath = path.replace(/^\/+/, '');
    if (!normalizedPath) {
      return `/${this.portalSegment()}`;
    }
    return `/${this.portalSegment()}/${normalizedPath}`;
  }
}
