import { Component, OnInit, computed, effect, output, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { StudentSingleData } from '../../../data/application/registrantdatadto';
import {
  ADDRESS_FIELDS,
  NEXT_OF_KIN_FIELDS,
  PERSONAL_CONTACT_FIELDS,
  STUDENT_PROFILE_MESSAGE,
  STUDENT_PROFILE_SECTION_HEADING
} from '../../../constants/student-profile.constants';
import {
  AddressData,
  EditableProfileSection,
  NextOfKinData,
  PersonalContactData,
  ProfileFieldOptions,
  ProfileSectionDraft
} from '../../../constants/student-profile.types';
import { StudentProfileOptionsService } from '../../../services/student-profile-options.service';
import { StudentProfileService } from '../../../services/student-profile.service';
import { ProfileSectionCardComponent } from '../profile-section-card/profile-section-card.component';

@Component({
  selector: 'app-student-profile-details',
  standalone: true,
  imports: [ProfileSectionCardComponent],
  templateUrl: './student-profile-details.component.html',
  styleUrl: './student-profile-details.component.scss'
})
export class StudentProfileDetailsComponent implements OnInit {
  readonly profileSaved = output<StudentSingleData>();

  readonly headings = STUDENT_PROFILE_SECTION_HEADING;

  readonly unavailableMessage = STUDENT_PROFILE_MESSAGE.unavailable;

  readonly personalFields = PERSONAL_CONTACT_FIELDS;

  readonly addressFields = ADDRESS_FIELDS;

  readonly nextOfKinFields = NEXT_OF_KIN_FIELDS;

  readonly personalDraft = signal<PersonalContactData | null>(null);

  readonly residentialDraft = signal<AddressData | null>(null);

  readonly nextOfKinResidenceDraft = signal<AddressData | null>(null);

  readonly personalStateName = computed(
    () => (this.personalDraft() ?? this.studentProfile.personalContact()).stateOfOrigin
  );

  readonly residentialStateName = computed(
    () => (this.residentialDraft() ?? this.studentProfile.residentialAddress()).state
  );

  readonly nextOfKinResidenceStateName = computed(
    () => (this.nextOfKinResidenceDraft() ?? this.studentProfile.nextOfKinResidence()).state
  );

  readonly personalOptions = computed<ProfileFieldOptions>(() => ({
    nationality: this.profileOptions.countryNames(),
    stateOfOrigin: this.profileOptions.stateNames(),
    lgaOfOrigin: this.profileOptions.lgaNamesForState(this.personalStateName())
  }));

  readonly residentialOptions = computed(() => this.buildAddressOptions(this.residentialStateName()));

  readonly nextOfKinResidenceOptions = computed(() => this.buildAddressOptions(this.nextOfKinResidenceStateName()));

  readonly savePersonal = (data: PersonalContactData): Promise<boolean> => this.saveSection({ section: 'personal', data });

  readonly saveResidential = (data: AddressData): Promise<boolean> => this.saveSection({ section: 'residential', data });

  readonly saveNextOfKin = (data: NextOfKinData): Promise<boolean> => this.saveSection({ section: 'nok', data });

  readonly saveNextOfKinResidence = (data: AddressData): Promise<boolean> =>
    this.saveSection({ section: 'nok-residence', data });

  constructor(
    readonly studentProfile: StudentProfileService,
    private readonly profileOptions: StudentProfileOptionsService,
    private readonly messageService: MessageService
  ) {
    effect(() => {
      this.profileOptions.stateNames();
      this.profileOptions.loadLgasForState(this.personalStateName());
      this.profileOptions.loadLgasForState(this.residentialStateName());
      this.profileOptions.loadLgasForState(this.nextOfKinResidenceStateName());
    });
  }

  ngOnInit(): void {
    this.profileOptions.loadLocations();
  }

  isSaving(section: EditableProfileSection): boolean {
    return this.studentProfile.savingSection() === section;
  }

  private buildAddressOptions(stateName: string): ProfileFieldOptions {
    return {
      state: this.profileOptions.stateNames(),
      lga: this.profileOptions.lgaNamesForState(stateName)
    };
  }

  private async saveSection(draft: ProfileSectionDraft): Promise<boolean> {
    const result = await this.studentProfile.saveProfileSection(draft);
    this.messageService.add({
      severity: result.ok ? 'success' : 'warn',
      summary: STUDENT_PROFILE_MESSAGE.toastSummary,
      detail: result.message
    });
    if (result.profile) {
      this.profileSaved.emit(result.profile);
    }
    return result.ok;
  }
}
