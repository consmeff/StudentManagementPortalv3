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
  title: 'APPLICATION GUIDELINE',
  intro:
    'Kindly read the Application Guideline carefully before you proceed with the application. It is very important to understand and follow the guideline to avoid error in your application.',
  sections: [
    {
      heading:
        'Candidates for admission into the Basic Midwifery program must possess the Senior Secondary School Certificate (SSCE) or its equivalent at credit level in the following five (5) subjects at not more than two (2) sittings:',
      items: ['Physics', 'Chemistry', 'Biology', 'English', 'Mathematics'],
    },
    {
      heading:
        'Candidates are required to upload the following documents in addition to other relevant documents:',
      items: [
        'Certificate of Birth',
        "O' Level (SSCE) Certificates",
        'Certificate of Origin',
        'Passport Photograph',
        'Jamb Result'
      ],
    },
    {
      heading:
        'Candidates are required to make payment of a non-refundable sum of Fifteen Thousand Naira (NGN25,500.00) as application fee, excluding charges.',
      items: [],
    },
    {
      heading:
        'Candidate must have a minimum JAMB score of 165 and must have chosen the institution as first choice in the 2024 UTME registration. Moreover, candidates who did not select CONSMMEFS as their first choice can change institution on the JAMB Portal.',
      items: [],
    },
    {
      heading:
        'Applying candidates must be at least sixteen (16) years of age by October before applying.',
      items: [],
    },
  ],
};
