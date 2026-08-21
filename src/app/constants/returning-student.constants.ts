export const RETURNING_STUDENT_PROFILE_CONFIG = {
  dateOfBirthLocale: 'en-GB',
  dateOfBirthOptions: { day: 'numeric', month: 'long', year: 'numeric' }
} as const;

export const RETURNING_STUDENT_STATUS_LABEL = {
  active: 'Active',
  inactive: 'Inactive'
} as const;

export const RETURNING_STUDENT_DISABILITY_LABEL = {
  present: 'Yes',
  absent: 'No'
} as const;

export const RETURNING_STUDENT_FAILED_GRADE = 'F';

export const RETURNING_STUDENT_PAYMENT_LABEL = {
  paidInFull: 'Paid in full'
} as const;
