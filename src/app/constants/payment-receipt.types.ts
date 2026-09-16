export const PAYMENT_RECEIPT_STATE = {
  loading: 'loading',
  loaded: 'loaded',
  missingReference: 'missingReference',
  error: 'error'
} as const;

export type PaymentReceiptState = (typeof PAYMENT_RECEIPT_STATE)[keyof typeof PAYMENT_RECEIPT_STATE];

export type PaymentReceiptNotice = {
  title: string;
  detail: string;
  iconClass: string;
};

export type PaymentReceiptResult = {
  title: string;
  detail: string;
  toneClass: string;
  iconClass: string;
};

export type PaymentReceiptField = {
  label: string;
  value: string;
};
