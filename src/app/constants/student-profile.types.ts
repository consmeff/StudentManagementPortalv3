import type { StudentSingleData } from '../data/application/registrantdatadto';
import type { PROFILE_FIELD_INPUT_TYPE } from './student-profile.constants';

export type PersonalContactData = {
  firstName: string;
  lastName: string;
  otherNames: string;
  email: string;
  phone: string;
  alternatePhone: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  stateOfOrigin: string;
  lgaOfOrigin: string;
  disability: string;
  specificDisability: string;
};

export type AddressData = {
  houseNumber: string;
  streetName: string;
  landmark: string;
  areaTown: string;
  state: string;
  lga: string;
};

export type NextOfKinData = {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  email: string;
  occupation: string;
  phone: string;
  alternatePhone: string;
};

export type EditableProfileSection = 'personal' | 'residential' | 'nok' | 'nok-residence';

export type ProfileSectionDraft =
  | { section: 'personal'; data: PersonalContactData }
  | { section: 'residential'; data: AddressData }
  | { section: 'nok'; data: NextOfKinData }
  | { section: 'nok-residence'; data: AddressData };

export type ProfileSectionValues = Record<string, string>;

export type ProfileFieldInputType = (typeof PROFILE_FIELD_INPUT_TYPE)[keyof typeof PROFILE_FIELD_INPUT_TYPE];

export type ProfileField<TValues extends ProfileSectionValues> = {
  key: keyof TValues & string;
  label: string;
  inputType: ProfileFieldInputType;
  autocomplete: string;
  readOnly?: boolean;
  required?: boolean;
  maxLength?: number;
  options?: readonly string[];
  resetsFields?: readonly (keyof TValues & string)[];
  enabledWhen?: { key: keyof TValues & string; value: string };
  minimumAgeYears?: number;
};

export type ProfileFieldOptions = Partial<Record<string, readonly string[]>>;

export type ProfileSectionPayloadContext = {
  nextOfKin: NextOfKinData;
  nextOfKinResidence: AddressData;
  residentialLgaId: number | null;
};

export type ProfileFieldErrors = Partial<Record<string, string>>;

export type ProfileSaveResult = {
  ok: boolean;
  message: string;
  profile: StudentSingleData | null;
};
