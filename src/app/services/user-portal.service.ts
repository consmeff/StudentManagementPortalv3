import { Injectable, inject } from '@angular/core';
import { AuthSessionStore } from '../store/auth-session.store';

export type PortalSegment = 'new' | 'admitted' | 'returning';

@Injectable({ providedIn: 'root' })
export class UserPortalService {
  private readonly authSessionStore = inject(AuthSessionStore);

  portalSegment(): PortalSegment {
    const userType = (this.authSessionStore.userType() || '').toLowerCase().trim();

    // uncomment this guy and fine-tune to determine returning student
    // const matriculationNo = (this.authSessionStore.matriculationNo() || '').trim();
    const matriculationNo = '';

    const admittedKeywords = ['admitted', 'admission', 'fresh', 'new student'];
    const returningKeywords = ['returning', 'matric', 'student', 'old'];

    // if (admittedKeywords.some((keyword) => userType.includes(keyword))) {
    //   return 'admitted';
    // }

    // if (returningKeywords.some((keyword) => userType.includes(keyword)) || !!matriculationNo) {
    //   return 'returning';
    // }

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
