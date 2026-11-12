import type { AddressData, NextOfKinData, PersonalContactData, ProfileField } from './student-profile.types';

export const PROFILE_FIELD_INPUT_TYPE = {
  text: 'text',
  email: 'email',
  tel: 'tel',
  date: 'date',
  select: 'select'
} as const;

export const STUDENT_MINIMUM_AGE_YEARS = 16;

export const STUDENT_PROFILE_GENDER_OPTIONS = ['Male', 'Female'] as const;

export const STUDENT_PROFILE_DATE_OF_BIRTH_FORMAT = {
  locale: 'en-GB',
  options: { day: 'numeric', month: 'long', year: 'numeric' }
} as const;

export const STUDENT_PROFILE_DISABILITY_LABEL = {
  present: 'Yes',
  absent: 'No'
} as const;

export const STUDENT_PROFILE_DISABILITY_OPTIONS = [
  STUDENT_PROFILE_DISABILITY_LABEL.present,
  STUDENT_PROFILE_DISABILITY_LABEL.absent
] as const;

export const STUDENT_PROFILE_MARITAL_STATUS_OPTIONS = ['Single', 'Married', 'Divorced', 'Separated', 'Widowed'] as const;

export const NEXT_OF_KIN_TITLE_OPTIONS = ['Mr.', 'Mrs.', 'Miss', 'Dr.', 'Prof.', 'Chief', 'Alhaji', 'Alhaja'] as const;

export const STUDENT_PROFILE_FIELD_MAX_LENGTH = {
  name: 255,
  phone: 70
} as const;

export const EMAIL_ADDRESS_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const OPTION_PUNCTUATION_PATTERN = /\./g;

export const STUDENT_PROFILE_VALIDATION_MESSAGE = {
  minimumAge: (minimumAgeYears: number): string => `You must be at least ${minimumAgeYears} years old.`,
  required: (fieldLabel: string): string => `${fieldLabel} is required.`,
  invalidEmail: 'Enter a valid email address.'
} as const;

export const STUDENT_PROFILE_MESSAGE = {
  toastSummary: 'Profile',
  saved: 'Profile changes saved successfully.',
  saveFailed: 'Unable to save profile changes right now.',
  unavailable: 'Your personal details will be editable here once your student record has been created after your school fees payment.'
} as const;

export const STUDENT_PROFILE_SECTION_HEADING = {
  personal: 'Personal Information',
  residential: 'Residential Information',
  nextOfKin: 'Next of Kin Information',
  nextOfKinResidence: 'Next of Kin Residence'
} as const;

export const NON_ALPHANUMERIC_PATTERN = /[^a-z0-9]+/g;

export const PROFILE_SECTION_CARD_LABEL = {
  editPrefix: 'Edit ',
  cancel: 'Cancel',
  save: 'Save',
  saving: 'Saving...',
  emptyValue: '—',
  selectPlaceholder: 'Select an option'
} as const;

const { text, email, tel, date, select } = PROFILE_FIELD_INPUT_TYPE;

const { name: nameMaxLength, phone: phoneMaxLength } = STUDENT_PROFILE_FIELD_MAX_LENGTH;

export const PERSONAL_CONTACT_FIELDS: readonly ProfileField<PersonalContactData>[] = [
  { key: 'firstName', label: 'First Name', inputType: text, autocomplete: 'given-name', required: true, maxLength: nameMaxLength },
  { key: 'lastName', label: 'Last Name', inputType: text, autocomplete: 'family-name', required: true, maxLength: nameMaxLength },
  { key: 'otherNames', label: 'Other Names', inputType: text, autocomplete: 'additional-name', maxLength: nameMaxLength },
  { key: 'email', label: 'Email Address', inputType: email, autocomplete: 'email', readOnly: true },
  { key: 'phone', label: 'Phone Number', inputType: tel, autocomplete: 'tel', required: true, maxLength: phoneMaxLength },
  { key: 'alternatePhone', label: 'Alternate Phone Number', inputType: tel, autocomplete: 'tel', maxLength: phoneMaxLength },
  { key: 'dateOfBirth', label: 'Date of Birth', inputType: date, autocomplete: 'bday', minimumAgeYears: STUDENT_MINIMUM_AGE_YEARS },
  { key: 'gender', label: 'Gender', inputType: text, autocomplete: 'sex', readOnly: true },
  {
    key: 'maritalStatus',
    label: 'Marital Status',
    inputType: select,
    autocomplete: 'off',
    required: true,
    options: STUDENT_PROFILE_MARITAL_STATUS_OPTIONS
  },
  { key: 'nationality', label: 'Nationality', inputType: select, autocomplete: 'country-name' },
  { key: 'stateOfOrigin', label: 'State of Origin', inputType: select, autocomplete: 'off', resetsFields: ['lgaOfOrigin'] },
  { key: 'lgaOfOrigin', label: 'LGA of Origin', inputType: select, autocomplete: 'off' },
  {
    key: 'disability',
    label: 'Living with Disability',
    inputType: select,
    autocomplete: 'off',
    options: STUDENT_PROFILE_DISABILITY_OPTIONS,
    resetsFields: ['specificDisability']
  },
  {
    key: 'specificDisability',
    label: 'Specific Disability',
    inputType: text,
    autocomplete: 'off',
    enabledWhen: { key: 'disability', value: STUDENT_PROFILE_DISABILITY_LABEL.present }
  }
];

export const ADDRESS_FIELDS: readonly ProfileField<AddressData>[] = [
  { key: 'houseNumber', label: 'House Number', inputType: text, autocomplete: 'address-line1' },
  { key: 'streetName', label: 'Street Name', inputType: text, autocomplete: 'address-line2' },
  { key: 'landmark', label: 'Landmark', inputType: text, autocomplete: 'off' },
  { key: 'areaTown', label: 'Area / Town', inputType: text, autocomplete: 'address-level2' },
  { key: 'state', label: 'State', inputType: select, autocomplete: 'address-level1', resetsFields: ['lga'] },
  { key: 'lga', label: 'Local Government Area', inputType: select, autocomplete: 'off' }
];

export const NEXT_OF_KIN_FIELDS: readonly ProfileField<NextOfKinData>[] = [
  { key: 'title', label: 'Title', inputType: select, autocomplete: 'off', required: true, options: NEXT_OF_KIN_TITLE_OPTIONS },
  { key: 'firstName', label: 'First Name', inputType: text, autocomplete: 'off', required: true, maxLength: nameMaxLength },
  { key: 'middleName', label: 'Other Names', inputType: text, autocomplete: 'off', maxLength: nameMaxLength },
  { key: 'lastName', label: 'Last Name', inputType: text, autocomplete: 'off', required: true, maxLength: nameMaxLength },
  { key: 'gender', label: 'Gender', inputType: select, autocomplete: 'off', required: true, options: STUDENT_PROFILE_GENDER_OPTIONS },
  { key: 'email', label: 'Email Address', inputType: email, autocomplete: 'off' },
  { key: 'occupation', label: 'Occupation', inputType: text, autocomplete: 'off' },
  { key: 'phone', label: 'Phone Number', inputType: tel, autocomplete: 'off', maxLength: phoneMaxLength },
  { key: 'alternatePhone', label: 'Alternate Phone Number', inputType: tel, autocomplete: 'off', maxLength: phoneMaxLength }
];
