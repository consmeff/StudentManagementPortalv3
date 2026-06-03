import { StudentFeePaymentPayload, StudentFeePlan } from '../data/application/student-fees.dto';

export function selectStudentFeePlan(plans: StudentFeePlan[]): StudentFeePlan | null {
  const schoolFeePlan = plans
    .filter((plan) => plan.label === 'school_fee')
    .slice()
    .sort((leftPlan, rightPlan) => leftPlan.display_order - rightPlan.display_order)[0];

  if (schoolFeePlan) {
    return schoolFeePlan;
  }

  return plans
    .slice()
    .sort((leftPlan, rightPlan) => leftPlan.display_order - rightPlan.display_order)[0] ?? null;
}

export function selectMatchingStudentFeePlan(
  plans: StudentFeePlan[],
  departmentId: number | null,
  levelId: number | null
): StudentFeePlan | null {
  const exactMatches = plans.filter((plan) =>
    (departmentId === null || plan.department === departmentId)
    && (levelId === null || plan.level === levelId)
  );

  return selectStudentFeePlan(exactMatches.length > 0 ? exactMatches : plans);
}

export function readStudentFeeInstallmentNumbers(plan: StudentFeePlan | null): number[] {
  if (!plan) {
    return [];
  }

  return Object.keys(plan.part_payment_config)
    .map((entry) => Number(entry))
    .filter((entry) => Number.isInteger(entry) && entry > 0)
    .sort((leftPlan, rightPlan) => leftPlan - rightPlan);
}

export function readStudentFeeInstallmentAmount(
  plan: StudentFeePlan | null,
  installmentNumber: number
): number | null {
  if (!plan || !Number.isInteger(installmentNumber) || installmentNumber <= 0) {
    return null;
  }

  const paymentEntry = plan.part_payment_config[String(installmentNumber)];
  if (!paymentEntry) {
    return null;
  }

  const [amount] = paymentEntry;
  return typeof amount === 'number' && Number.isFinite(amount) ? amount : null;
}

export function buildStudentFeePaymentPayload(plan: StudentFeePlan): StudentFeePaymentPayload {
  return {
    fee_id: String(plan.id),
    amount: plan.amount,
  };
}

export function buildStudentFeePaymentPayloadForAmount(
  plan: StudentFeePlan,
  amount: number
): StudentFeePaymentPayload {
  return {
    ...buildStudentFeePaymentPayload(plan),
    amount,
  };
}
