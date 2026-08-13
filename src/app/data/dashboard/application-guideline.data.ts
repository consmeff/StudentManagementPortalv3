import { formatNairaAmount, formatNairaAmountInWords } from '../../utility/naira-amount';

export interface GuidelineSection {
  heading: string;
  items: string[];
}

export interface ApplicationGuidelineContent {
  title: string;
  intro: string;
  sections: GuidelineSection[];
}

export interface ApplicationFeeAmounts {
  amount: number;
  processingFee: number;
}

export const DEFAULT_APPLICATION_FEE_AMOUNTS: ApplicationFeeAmounts = {
  amount: 20500,
  processingFee: 2500,
};

function buildApplicationFeeHeading(fee: ApplicationFeeAmounts): string {
  const feeInWords = formatNairaAmountInWords(fee.amount);
  const feeInFigures = formatNairaAmount(fee.amount);

  if (fee.processingFee <= 0) {
    return `Candidates are required to pay a non-refundable application fee of ${feeInWords} (${feeInFigures}).`;
  }

  const processingFeeInFigures = formatNairaAmount(fee.processingFee);
  const totalInFigures = formatNairaAmount(fee.amount + fee.processingFee);
  return `Candidates are required to pay a non-refundable application fee of ${feeInWords} (${feeInFigures}), in addition to ${processingFeeInFigures} being portal and payment gateway charges. Total application fee is ${totalInFigures}.`;
}

export function buildApplicationGuidelineContent(
  fee: ApplicationFeeAmounts = DEFAULT_APPLICATION_FEE_AMOUNTS
): ApplicationGuidelineContent {
  return {
    title: 'ADMISSION GUIDELINE FOR ND PROGRAMMES 2026/2027 ACADEMIC SESSION',
    intro:
      'Please review all the details below carefully and ensure compliance before proceeding with making payment and filling out application form. No refunds will be issued after payment.',
    sections: [
      {
        heading:
          'Candidates seeking admission into the ND Programmes must possess the Senior Secondary School Certificate (SSCE) or its equivalent with credit passes in the following five (5) subjects:',
        items: ['Physics', 'Chemistry', 'Biology', 'English Language', 'Mathematics'],
      },
      {
        heading:
          'Results must be obtained in not more than two (2) sittings for SSCE or one (1) sitting for NABTEB.',
        items: [],
      },
      {
        heading:
          'In addition to other relevant documents, candidates are required to upload the following:',
        items: [
          'Birth Certificate',
          'O’ Level (SSCE), NABTEB, or equivalent certificates (where applicable)',
          'Certificate of Origin',
          'Passport Photograph',
          'UTME Result Slip',
        ],
      },
      {
        heading:
          'Candidates must have scored a minimum of 165 in the 2026 UTME and must have selected CONSMMEFS or the relevant course as their first choice during UTME registration. Candidates who did not initially select CONSMMEFS or their preferred course as first choice may apply, but must effect a change of institution/course on the JAMB Portal.',
        items: [],
      },
      {
        heading: buildApplicationFeeHeading(fee),
        items: [],
      },
      {
        heading:
          'Applicants must be at least sixteen (16) years of age at the time of application.',
        items: [],
      },
    ],
  };
}
