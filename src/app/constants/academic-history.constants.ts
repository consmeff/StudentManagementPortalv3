export const ACADEMIC_HISTORY_RULES = {
  primarySchoolMinimumCompletionAge: 6,
  secondarySchoolMinimumCompletionAge: 12,
  jambRegistrationNumberMaxLength: 14,
  jambScoreMin: 0,
  jambScoreMax: 400
} as const;

export const ACADEMIC_HISTORY_AWAITING_RESULT_OPTION = 'Awaiting Result' as const;

export const ACADEMIC_HISTORY_ATTEMPT_OPTIONS = [
  '1',
  '2',
  ACADEMIC_HISTORY_AWAITING_RESULT_OPTION
] as const;
