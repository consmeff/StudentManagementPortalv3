export type StudentFeePartPaymentMode = 'flat' | string;

export type StudentFeePartPaymentEntry = [number, StudentFeePartPaymentMode];

export type StudentFeePartPaymentConfig = Record<string, StudentFeePartPaymentEntry>;

export type StudentFeePlan = {
  id: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  display_order: number;
  label: string;
  name: string;
  amount: number;
  allow_partial_payment: boolean;
  part_payment_config: StudentFeePartPaymentConfig;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
  department: number;
  level: number;
};

export type StudentFeePlanResponse = {
  data: StudentFeePlan[];
};

export type StudentSchoolFeePaymentStatus = {
  total_paid: number;
  total_due: number;
  number_of_payments: number;
  status: string;
};

export type StudentSchoolFeeStatus = StudentFeePlan & {
  payment_status: StudentSchoolFeePaymentStatus;
};

export type StudentFeePaymentPayload = {
  fee_id: string;
  amount: number;
};
