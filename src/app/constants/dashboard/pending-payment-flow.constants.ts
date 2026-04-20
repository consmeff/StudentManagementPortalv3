export const HERO_CONTENT = {
  pending: {
    title: 'Complete your application to apply for admission',
    description:
      'You have created your account. To apply, choose your course, pay the application fee, and fill in your details.',
    actionLabel: 'Continue Application',
  },
  paid: {
    title: 'Continue your admission process',
    description: 'Your application fee has been confirmed. Continue to complete your admission form.',
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
    title: 'Submit application and await admission decision',
    description:
      'Your application will be reviewed by the admissions team. You will be notified of the outcome via this portal and SMS.',
  },
} as const;

export const ROUTES = {
  admissionForm: '/pages/admissionform',
} as const;

export const ACTION_LABELS = {
  continueApplication: 'Continue Application',
  continueToForm: 'Continue to Form',
  continueToPayment: 'Continue to Payment',
} as const;

export const STATUS_MATCHERS = {
  paymentNegativeKeywords: ['pending', 'fail', 'unpaid'],
  paymentPositiveKeywords: ['paid', 'complete', 'success'],
  submissionCompleted: ['submitted', 'under_review', 'approved', 'rejected'],
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
