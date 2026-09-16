export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | string;

export type PaymentRefResponse = {
  ref_id: string;
  amount: number;
  amount_paid: number | null;
  payment_type: string;
  status: PaymentStatus;
  summary: string;
  email: string;
  payment_url?: string;
};

export type PaymentHistoryItem = {
  ref_id: string;
  payment_type: string;
  amount: number;
  amount_paid: number | null;
  status: PaymentStatus;
  summary: string;
  created_at: string;
  applicant_no: string;
  applicant_name: string;
};

export type PaginatedPaymentsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PaymentHistoryItem[];
};

export type PaymentReceiptVerification = {
  is_valid: boolean;
  status: string;
  message: string;
  receipt_no: string | null;
  reference_no: string;
  payment_type: string | null;
  amount: number | null;
  amount_paid: number | null;
  paid_by: string | null;
  application_no: string | null;
  session: string | null;
  issued_at: string | null;
  verified_at: string | null;
};
