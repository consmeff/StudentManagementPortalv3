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
