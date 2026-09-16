export const PAYMENT_RECEIPT_CONFIG = {
  institutionName: 'CONSMMEFS',
  institutionTagline: 'Student Payment Portal',
  logoPath: '/assets/consmmefs-logo.png',
  documentTitle: 'Receipt Verification',
  routePath: 'payment-receipt-verify',
  referenceQueryParam: 'ref_id',
  loginPath: '/auth/login',
  qrSizePx: 168,
  qrInstruction: 'Scan to verify this receipt',
  qrDescriptionPrefix: 'QR code linking to the verification page for payment reference'
} as const;

export const PAYMENT_RECEIPT_RESULT = {
  valid: {
    title: 'Verified receipt',
    fallbackDetail: 'This receipt matches a payment record.',
    toneClass: 'verification-banner--valid',
    iconClass: 'pi pi-verified'
  },
  invalid: {
    title: 'Receipt could not be verified',
    fallbackDetail: 'No payment record matches this reference.',
    toneClass: 'verification-banner--invalid',
    iconClass: 'pi pi-times-circle'
  }
} as const;

export const PAYMENT_RECEIPT_NOTICES = {
  missingReference: {
    title: 'Invalid receipt link',
    detail: 'This link is missing a payment reference. Scan the QR code on the receipt again.',
    iconClass: 'pi pi-link'
  },
  error: {
    title: 'Verification is unavailable',
    detail: 'We could not reach the verification service. Check your connection and try again.',
    iconClass: 'pi pi-exclamation-triangle'
  }
} as const;

export const PAYMENT_RECEIPT_MESSAGES = {
  loading: 'Verifying receipt...',
  preparingDownload: 'Preparing...'
} as const;

export const PAYMENT_RECEIPT_FIELD_LABELS = {
  receiptNumber: 'Receipt No',
  referenceNumber: 'Reference No',
  paymentType: 'Payment Type',
  paidBy: 'Paid By',
  applicationNumber: 'Application No',
  session: 'Session',
  amount: 'Amount',
  amountPaid: 'Amount Paid',
  issuedAt: 'Issued At',
  verifiedAt: 'Verified At'
} as const;

export const PAYMENT_RECEIPT_DOWNLOAD = {
  lookupPageSize: 100,
  lookupOrdering: '-created_at',
  toastSummary: 'Receipt',
  emptyFileDetail: 'The receipt file for this payment is not available yet.',
  noCompletedPaymentsDetail: 'No completed payment was found to generate a receipt for.'
} as const;

export const PAYMENT_TYPE_KEYWORDS = {
  schoolFees: 'school fee',
  acceptanceFee: 'acceptance'
} as const;
