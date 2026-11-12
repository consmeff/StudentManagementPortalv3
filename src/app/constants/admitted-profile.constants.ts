export const SUBMIT_VERIFICATION_LABELS = {
  idle: 'Submit for Verification',
  submitting: 'Submitting...',
  submitted: 'Submitted for Verification',
  resubmit: 'Resubmit for Verification',
} as const;

export const FLAGGED_ADMISSION_DOCUMENTS_COPY = {
  title: 'Some of your documents were flagged',
  instruction: 'Replace the affected letter of recommendation or testimonial, then resubmit for verification.',
} as const;

export const ADMITTED_PROFILE_TAB = {
  documents: 'documents',
  personal: 'personal',
} as const;

export const ADMITTED_PROFILE_TABS = [
  { id: ADMITTED_PROFILE_TAB.documents, label: 'Document Verification' },
  { id: ADMITTED_PROFILE_TAB.personal, label: 'Personal and Contact' },
] as const;

export const ADMITTED_PROFILE_PAGE_COPY = {
  title: 'Profile',
  tabsLabel: 'Profile sections',
} as const;
