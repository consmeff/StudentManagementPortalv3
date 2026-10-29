export const ACCEPTANCE_PAYMENT_SYNC_CONFIG = {
  singleAttempt: 1,
  maxPollingAttempts: 4,
  retryDelayMs: 2500
} as const;

export const PAYMENT_REFERENCE_QUERY_PARAMS = ['reference', 'trxref', 'ref_id'] as const;
