export interface GuidelineSection {
  heading: string;
  items: string[];
}

export interface ApplicationGuidelineContent {
  title: string;
  intro: string;
  sections: GuidelineSection[];
}

export const APPLICATION_GUIDELINE_CONTENT: ApplicationGuidelineContent = {
  title: 'ADMISSION REQUIREMENTS FOR ND PROGRAMMES',
  intro:
    'Kindly read the admission requirements carefully before you proceed with the application. It is important to understand and follow the requirements to avoid errors in your application.',
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
      heading:
        'Candidates are required to pay a non-refundable application fee of Twenty Thousand Five Hundred Naira Only (NGN 20,500.00), in addition to NGN 2,488.25 being portal and payment gateway charges. Total application fee is NGN 22,988.25.',
      items: [],
    },
    {
      heading:
        'Applicants must be at least sixteen (16) years of age at the time of application.',
      items: [],
    },
  ],
};
