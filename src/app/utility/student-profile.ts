import { Address, AryParentOrGuardian, StudentSingleData } from '../data/application/registrantdatadto';
import {
  StudentAddressPayload,
  StudentGuardianPayload,
  StudentProfileUpdatePayload
} from '../data/application/student-profile.dto';
import {
  STUDENT_PROFILE_DATE_OF_BIRTH_FORMAT,
  STUDENT_PROFILE_DISABILITY_LABEL,
  NEXT_OF_KIN_TITLE_OPTIONS,
  OPTION_PUNCTUATION_PATTERN,
  STUDENT_PROFILE_GENDER_OPTIONS,
  STUDENT_PROFILE_MARITAL_STATUS_OPTIONS
} from '../constants/student-profile.constants';
import {
  AddressData,
  NextOfKinData,
  PersonalContactData,
  ProfileSectionDraft,
  ProfileSectionPayloadContext
} from '../constants/student-profile.types';
import { formatDateOnly, parseDateOnly } from './date-only';

const ADDRESS_PART_SEPARATOR = ',';
const ADDRESS_PART_JOINER = ', ';

export function buildEmptyAddress(): AddressData {
  return {
    houseNumber: '',
    streetName: '',
    landmark: '',
    areaTown: '',
    state: '',
    lga: ''
  };
}

export function formatDateOfBirth(dateOfBirth: string | null | undefined): string {
  const parsedDate = parseDateOnly(dateOfBirth);
  if (!parsedDate) {
    return '';
  }
  return parsedDate.toLocaleDateString(
    STUDENT_PROFILE_DATE_OF_BIRTH_FORMAT.locale,
    STUDENT_PROFILE_DATE_OF_BIRTH_FORMAT.options
  );
}

export function readLatestBirthDateForAge(minimumAgeYears: number): string {
  const today = new Date();
  return formatDateOnly(new Date(today.getFullYear() - minimumAgeYears, today.getMonth(), today.getDate()));
}

export function isYoungerThan(dateOfBirth: string, minimumAgeYears: number): boolean {
  const normalizedDateOfBirth = formatDateOnly(parseDateOnly(dateOfBirth));
  return normalizedDateOfBirth !== '' && normalizedDateOfBirth > readLatestBirthDateForAge(minimumAgeYears);
}

export function matchKnownOption(options: readonly string[], value: string | null | undefined): string {
  const trimmedValue = (value ?? '').trim();
  const comparableValue = toComparableOption(trimmedValue);
  return options.find((option) => toComparableOption(option) === comparableValue) ?? trimmedValue;
}

function toComparableOption(option: string): string {
  return option.replace(OPTION_PUNCTUATION_PATTERN, '').toLowerCase();
}

export function mapPersonalContact(profile: StudentSingleData | null): PersonalContactData {
  return {
    firstName: profile?.first_name ?? '',
    lastName: profile?.last_name ?? '',
    otherNames: profile?.other_names ?? '',
    email: profile?.email ?? '',
    phone: profile?.phone_number ?? '',
    alternatePhone: profile?.alt_phone_number ?? '',
    dateOfBirth: formatDateOnly(profile?.dob),
    gender: matchKnownOption(STUDENT_PROFILE_GENDER_OPTIONS, profile?.gender),
    maritalStatus: matchKnownOption(STUDENT_PROFILE_MARITAL_STATUS_OPTIONS, profile?.marital_status),
    nationality: profile?.nationality ?? '',
    stateOfOrigin: profile?.state_of_origin ?? '',
    lgaOfOrigin: profile?.lga ?? '',
    disability: profile?.disability ? STUDENT_PROFILE_DISABILITY_LABEL.present : STUDENT_PROFILE_DISABILITY_LABEL.absent,
    specificDisability: profile?.disability ?? ''
  };
}

export function mapStudentAddress(address: Address | null | undefined): AddressData {
  if (!address) {
    return buildEmptyAddress();
  }
  return {
    houseNumber: (address.address ?? '').split(ADDRESS_PART_SEPARATOR)[0].trim(),
    streetName: address.street_name ?? '',
    landmark: address.land_mark ?? '',
    areaTown: address.city ?? '',
    state: address.state?.name ?? '',
    lga: address.lga?.name ?? ''
  };
}

export function mapNextOfKin(guardian: AryParentOrGuardian | null | undefined): NextOfKinData {
  return {
    title: matchKnownOption(NEXT_OF_KIN_TITLE_OPTIONS, guardian?.title),
    firstName: guardian?.first_name ?? '',
    middleName: guardian?.other_names ?? '',
    lastName: guardian?.last_name ?? '',
    gender: matchKnownOption(STUDENT_PROFILE_GENDER_OPTIONS, guardian?.gender),
    email: guardian?.email ?? '',
    occupation: guardian?.occupation ?? '',
    phone: guardian?.phone_number ?? '',
    alternatePhone: guardian?.alt_phone_number ?? ''
  };
}

export function mapGuardianAddress(guardian: AryParentOrGuardian | null | undefined): AddressData {
  if (!guardian) {
    return buildEmptyAddress();
  }
  const [houseNumber = '', streetName = '', landmark = '', areaTown = ''] = (guardian.residential_address ?? '')
    .split(ADDRESS_PART_SEPARATOR)
    .map((part) => part.trim());
  return {
    houseNumber,
    streetName,
    landmark,
    areaTown,
    state: guardian.state_of_origin ?? '',
    lga: guardian.lga ?? ''
  };
}

export function buildProfileSectionPayload(
  draft: ProfileSectionDraft,
  context: ProfileSectionPayloadContext
): StudentProfileUpdatePayload {
  if (draft.section === 'personal') {
    return buildPersonalContactPayload(draft.data);
  }
  if (draft.section === 'residential') {
    return { residential_address: buildAddressPayload(draft.data, context.residentialLgaId) };
  }
  if (draft.section === 'nok') {
    return { primary_parent_or_guardian: buildGuardianPayload(draft.data, context.nextOfKinResidence) };
  }
  return { primary_parent_or_guardian: buildGuardianPayload(context.nextOfKin, draft.data) };
}

function buildPersonalContactPayload(personalContact: PersonalContactData): StudentProfileUpdatePayload {
  return {
    first_name: personalContact.firstName.trim(),
    last_name: personalContact.lastName.trim(),
    other_names: personalContact.otherNames.trim(),
    phone_number: personalContact.phone.trim(),
    alt_phone_number: personalContact.alternatePhone.trim(),
    dob: formatDateOnly(parseDateOnly(personalContact.dateOfBirth)) || null,
    marital_status: personalContact.maritalStatus,
    nationality: personalContact.nationality,
    state_of_origin: personalContact.stateOfOrigin,
    lga: personalContact.lgaOfOrigin,
    disability: readDisabilityPayload(personalContact)
  };
}

function buildAddressPayload(address: AddressData, lgaId: number | null): StudentAddressPayload {
  return prunePayload({
    address: composeAddressLine(address),
    street_name: address.streetName,
    land_mark: address.landmark,
    city: address.areaTown,
    lga_id: lgaId ?? undefined
  });
}

function buildGuardianPayload(guardian: NextOfKinData, residence: AddressData): StudentGuardianPayload {
  return prunePayload({
    title: guardian.title,
    first_name: guardian.firstName.trim(),
    last_name: guardian.lastName.trim(),
    other_names: guardian.middleName.trim(),
    gender: guardian.gender,
    email: guardian.email.trim(),
    occupation: guardian.occupation,
    phone_number: guardian.phone.trim(),
    alt_phone_number: guardian.alternatePhone.trim(),
    residential_address: composeAddressLine(residence),
    state_of_origin: residence.state,
    lga: residence.lga
  });
}

function composeAddressLine(address: AddressData): string {
  return [address.houseNumber, address.streetName, address.landmark, address.areaTown]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(ADDRESS_PART_JOINER);
}

function readDisabilityPayload(personalContact: PersonalContactData): string | null {
  const hasDisability =
    personalContact.disability.trim().toLowerCase() === STUDENT_PROFILE_DISABILITY_LABEL.present.toLowerCase();
  if (!hasDisability) {
    return null;
  }
  return personalContact.specificDisability.trim() || STUDENT_PROFILE_DISABILITY_LABEL.present;
}

function prunePayload<TPayload extends object>(payload: TPayload): TPayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== '')
  ) as TPayload;
}
