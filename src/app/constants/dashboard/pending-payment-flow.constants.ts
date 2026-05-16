import { ApplicationStatusKey } from '../application-status.types';

export const HERO_CONTENT = {
  pending: {
    title: 'Complete your application process',
    description:
      'You have created your account. To apply, choose your course, pay the application fee, and fill in your details.',
    actionLabel: 'Continue Application',
  },
  paid: {
    title: 'Continue your application process',
    description: 'Your application fee has been confirmed. Continue to complete your application form.',
    actionLabel: 'Continue to Form',
  },
} as const;

export const STEP_CONTENT = {
  createAccount: {
    title: 'Create your account',
    description: 'Name, phone number and password registered successfully.',
  },
  chooseCourseAndPay: {
    title: 'Choose course & pay application fee',
    pendingDescription:
      'Select the programme you want to apply for and pay the non-refundable application fee to proceed.',
    completedDescription: 'Programme selected and payment completed.',
  },
  fillApplicationForm: {
    title: 'Fill your application form',
    description: 'Fill in your Personal details, Next of Kin details and Academic history.',
  },
  uploadDocuments: {
    title: 'Upload supporting documents',
    description: "O'level result, passport photograph, JAMB result slip, Birth certificate in JPEG, PNG or PDF format.",
  },
  submitApplication: {
    title: 'Submit application and await application decision',
    description:
      'Your application will be reviewed by the applications team. You will be notified of the outcome via this portal and SMS.',
  },
} as const;

export const ROUTES = {
  admissionForm: '/pages/admissionform',
} as const;

export const ACTION_LABELS = {
  continueApplication: 'Continue Application',
  continueToForm: 'Continue to Form',
  continueToPayment: 'Continue to Payment',
  editApplicationDetails: 'Edit Application Details',
  viewApplicationSummary: 'View Application Summary',
} as const;

export const STATUS_MATCHERS = {
  paymentNegativeKeywords: ['pending', 'fail', 'unpaid'],
  paymentPositiveKeywords: ['paid', 'complete', 'success'],
  submissionCompleted: ['submitted', 'approved', 'rejected', 'resubmitted', 'shortlisted', 'admitted', 'compliance_required', 'admitted_internally', 'auto_rejected'],
} as const;

export type DashboardApprovalMessage = {
  title: string;
  detail: string;
  tone: 'info' | 'success' | 'warning' | 'danger';
};

export const APPROVAL_STATUS_MESSAGES: Record<ApplicationStatusKey, DashboardApprovalMessage> = {
  submitted: {
    title: 'Submitted',
    detail: 'Your completed application has been received and is awaiting review.',
    tone: 'info',
  },
  approved: {
    title: 'Approved',
    detail: 'Your application has been approved provisionally or unconditionally and is still inconclusive.',
    tone: 'info',
  },
  rejected: {
    title: 'Rejected',
    detail: 'Your application was not successful.',
    tone: 'danger',
  },
  resubmitted: {
    title: 'Resubmitted',
    detail: 'Your updated application has been submitted again and is awaiting review.',
    tone: 'info',
  },
  pending: {
    title: 'Pending',
    detail: 'Your application is being reviewed. You will be notified once there is an update.',
    tone: 'warning',
  },
  shortlisted: {
    title: 'Shortlisted',
    detail: 'Check your email for examination scheduling details.',
    tone: 'success',
  },
  admitted: {
    title: 'Admitted',
    detail: 'Congratulations. Your application decision is now available on the portal.',
    tone: 'success',
  },
  compliance_required: {
    title: 'Complaince Required',
    detail: 'Your application needs an update before the application review can continue.',
    tone: 'warning',
  },
  admitted_internally: {
    title: 'Pending Publish',
    detail: 'Your application decision has not been published yet.',
    tone: 'warning',
  },
  auto_rejected: {
    title: 'Auto Unqualified',
    detail: 'Your application did not meet the application requirements.',
    tone: 'danger',
  },
  unknown: {
    title: '',
    detail: '',
    tone: 'info',
  },
} as const;

export const UI_COPY = {
  defaultApplicantName: 'Applicant',
  defaultPaymentStatus: 'Pending',
  loadApplicationsError: 'Unable to load open applications. Please try again.',
  noOpenApplications: 'No open applications are currently available.',
  selectProgrammeError: 'Please select a programme before continuing.',
  initializeApplicationError: 'Unable to initialize your application for payment. Please try again.',
  missingApplicationNoError: 'Unable to continue because application number was not returned.',
} as const;
