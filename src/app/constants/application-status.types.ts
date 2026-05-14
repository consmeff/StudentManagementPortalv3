export type ApplicationStatusTone =
  | 'pending'
  | 'shortlisted'
  | 'directive'
  | 'resubmitted'
  | 'rejected'
  | 'approved'
  | 'admitted'
  | 'neutral';

export type ApplicationStatusKey =
  | 'submitted'
  | 'approved'
  | 'rejected'
  | 'resubmitted'
  | 'pending'
  | 'shortlisted'
  | 'admitted'
  | 'compliance_required'
  | 'admitted_internally'
  | 'auto_rejected'
  | 'unknown';

export type ApplicationStatusDefinition = {
  key: ApplicationStatusKey;
  label: string;
  description: string;
  tone: ApplicationStatusTone;
};

export type ApplicationStatusOption = {
  label: string;
  value: Exclude<ApplicationStatusKey, 'unknown'>;
};
