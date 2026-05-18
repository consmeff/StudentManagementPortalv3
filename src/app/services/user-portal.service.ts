import { Injectable, inject } from '@angular/core';
import { AuthSessionStore } from '../store/auth-session.store';

export type PortalSegment = 'new' | 'admitted' | 'returning';

const ADMITTED_KEYWORDS = ['admitted', 'admission', 'fresh', 'new student'];
const RETURNING_KEYWORDS = ['returning', 'matric', 'student', 'old'];

@Injectable({ providedIn: 'root' })
export class UserPortalService {
  private readonly authSessionStore = inject(AuthSessionStore);

  portalSegment(): PortalSegment {
    const userType = (this.authSessionStore.userType() || '').toLowerCase().trim();
    const matriculationNo = (this.authSessionStore.matriculationNo() || '').trim();

    if (ADMITTED_KEYWORDS.some((keyword) => userType.includes(keyword))) {
      return 'admitted';
    }

    if (RETURNING_KEYWORDS.some((keyword) => userType.includes(keyword)) || !!matriculationNo) {
      return 'returning';
    }

    return 'new';
  }

  isNewCandidatePortal(): boolean {
    return this.portalSegment() === 'new';
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
