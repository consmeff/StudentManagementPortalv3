import { Inject, Injectable, computed, signal } from '@angular/core';
import { catchError, firstValueFrom, of } from 'rxjs';
import { StudentSingleData } from '../data/application/registrantdatadto';
import { STUDENT_PROFILE_MESSAGE } from '../constants/student-profile.constants';
import { EditableProfileSection, ProfileSaveResult, ProfileSectionDraft } from '../constants/student-profile.types';
import { AuthSessionStore } from '../store/auth-session.store';
import { resolveHttpErrorMessage } from '../utility/http-error-message';
import {
  buildProfileSectionPayload,
  mapGuardianAddress,
  mapNextOfKin,
  mapPersonalContact,
  mapStudentAddress
} from '../utility/student-profile';
import { ApplicationService } from './application.service';
import { StudentProfileOptionsService } from './student-profile-options.service';

@Injectable({ providedIn: 'root' })
export class StudentProfileService {
  readonly savingSection = signal<EditableProfileSection | null>(null);

  readonly hasStudentRecord = computed(() => this.authSessionStore.studentProfile() !== null);

  readonly personalContact = computed(() => mapPersonalContact(this.authSessionStore.studentProfile()));

  readonly residentialAddress = computed(() =>
    mapStudentAddress(this.authSessionStore.studentProfile()?.residential_address)
  );

  readonly nextOfKin = computed(() =>
    mapNextOfKin(this.authSessionStore.studentProfile()?.primary_parent_or_guardian)
  );

  readonly nextOfKinResidence = computed(() =>
    mapGuardianAddress(this.authSessionStore.studentProfile()?.primary_parent_or_guardian)
  );

  constructor(
    private readonly applicationService: ApplicationService,
    private readonly profileOptions: StudentProfileOptionsService,
    @Inject(AuthSessionStore) private readonly authSessionStore: InstanceType<typeof AuthSessionStore>
  ) {}

  async saveProfileSection(draft: ProfileSectionDraft): Promise<ProfileSaveResult> {
    this.savingSection.set(draft.section);
    try {
      const payload = buildProfileSectionPayload(draft, {
        nextOfKin: this.nextOfKin(),
        nextOfKinResidence: this.nextOfKinResidence(),
        residentialLgaId: this.resolveResidentialLgaId(draft)
      });
      await firstValueFrom(this.applicationService.updateStudentProfile(payload));
      const profile = await this.fetchStudentProfile();
      if (profile) {
        this.authSessionStore.setStudentProfile(profile);
      }
      return { ok: true, message: STUDENT_PROFILE_MESSAGE.saved, profile };
    } catch (error) {
      return {
        ok: false,
        message: resolveHttpErrorMessage(error, STUDENT_PROFILE_MESSAGE.saveFailed),
        profile: null
      };
    } finally {
      this.savingSection.set(null);
    }
  }

  private resolveResidentialLgaId(draft: ProfileSectionDraft): number | null {
    if (draft.section !== 'residential') {
      return null;
    }
    return this.profileOptions.findLgaId(draft.data.state, draft.data.lga);
  }

  private async fetchStudentProfile(): Promise<StudentSingleData | null> {
    const response = await firstValueFrom(this.applicationService.studentData().pipe(catchError(() => of(null))));
    return response?.data ?? null;
  }
}
