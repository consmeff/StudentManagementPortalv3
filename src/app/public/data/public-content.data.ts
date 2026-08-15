/**
 * Editable content for the public marketing site.
 *
 * This is the only file to touch for copy changes while the site is static.
 * When a CMS/API lands, delete these constants and have `PublicContentService`
 * map the responses onto the same models — no component changes required.
 *
 * Photography: drop files into `src/assets/images/public/` and point the
 * `*Url` fields at them. Anything left `null` renders a neutral placeholder.
 */
import {
  ContactDetails,
  DirectorsSpeech,
  Facility,
  FooterLink,
  HeroContent,
  NewsArticle,
  Objective,
  Programme,
  SiteIdentity,
  SocialLink,
  TeamMember
} from '../models/public-content.models';

/** Photography already present in the repo. */
const STUDENTS_PHOTO = 'assets/images/carousel-image-1.jpeg';
const CAMPUS_BUILDING = 'assets/images/carousel-image-2.jpeg';

export const SITE_IDENTITY: SiteIdentity = {
  institutionName: 'College of Nursing Sciences',
  foundationName: 'Muslim Medical Foundation',
  aboutBlurb:
    'Muslim Hospital, Saki was established in 1987 which as at the time was the first of its kind in Nigeria, by the Saki Muslim Community.',
  copyrightHolder: 'College of Nursing Sciences, Muslim Medical Foundation, Saki.'
};

export const HERO_CONTENT: HeroContent = {
  titleLines: ['College of Nursing Sciences', 'Muslim Medical Foundation'],
  subtitle:
    'To produce trained Midwives who are competent, skilled and always available to provide maternal and infant services at all tiers of health care delivery.',
  ctaLabel: 'Apply Now',
  ctaRoute: '/auth/signup',
  imageUrl: CAMPUS_BUILDING,
  imageAlt: 'The College of Nursing Sciences campus building in Saki, Oyo State'
};

export const OBJECTIVES: Objective[] = [
  {
    id: 'quality-education',
    title: 'Quality Education',
    description:
      'To give qualitative education to student midwives whose services will be required at our health institutions and general health care e.g. Comprehensive maternal and infant care'
  },
  {
    id: 'community-service',
    title: 'Community Service',
    description:
      'To make available higher institutions that would absorb the growing students population in our secondary schools in the Oke-Ogun area of Oyo State.'
  },
  {
    id: 'maternal-care',
    title: 'Maternal Care',
    description:
      'To mould the students through sound, moral, culture and practice and to train midwives who will take care of specific and religious needs of patients/ clients in our hospitals and communities.'
  },
  {
    id: 'research',
    title: 'Research',
    description:
      'To contribute to medical and nursing research in the hospital and the community and provide necessary midwives manpower for the Muslim Hospital, Saki and health care institutions in Oke-Ogun area of Oyo State.'
  }
];

export const DIRECTORS_SPEECH: DirectorsSpeech = {
  heading: "Director's Speech",
  paragraphs: [
    'To give qualitative education to student midwives whose services will be required at our health institutions and general health care e.g. Comprehensive maternal and infant care.',
    'To give qualitative education to student midwives whose services will be required at our health institutions and general health care e.g. Comprehe...'
  ],
  readMoreRoute: '/about',
  portraitUrl: null,
  portraitAlt: 'Portrait of the Provost/Director of Nursing Education'
};

export const MANAGEMENT_TEAM: TeamMember[] = [
  { id: 'provost', name: 'Alhaja Kehinde O. O.', role: 'Provost/Director of Nursing Education', photoUrl: null },
  { id: 'deputy-provost', name: 'Alhaja Kehinde O. O.', role: 'Provost/Director of Nursing Education', photoUrl: null },
  { id: 'registrar', name: 'Alhaja Kehinde O. O.', role: 'Provost/Director of Nursing Education', photoUrl: null },
  { id: 'bursar', name: 'Alhaja Kehinde O. O.', role: 'Provost/Director of Nursing Education', photoUrl: null }
];

export const PROGRAMMES: Programme[] = [
  { id: 'nd-hnd-nursing', name: 'ND/HND Nursing', route: null },
  { id: 'post-basic-nursing', name: 'Post Basic Nursing', route: null },
  { id: 'post-basic-midwifery', name: 'Post Basic Midwifery', route: null },
  { id: 'community-nursing', name: 'Community Nursing', route: null },
  { id: 'community-midwifery', name: 'Community Midwifery', route: null }
];

export const PROGRAMMES_IMAGE = CAMPUS_BUILDING;

export const FACILITIES: Facility[] = [
  { id: 'library', name: 'Library', imageUrl: CAMPUS_BUILDING },
  { id: 'skills-lab', name: 'Skills Laboratory', imageUrl: CAMPUS_BUILDING },
  { id: 'hostel', name: 'Hostel', imageUrl: CAMPUS_BUILDING },
  { id: 'lecture-hall', name: 'Lecture Hall', imageUrl: CAMPUS_BUILDING },
  { id: 'computer-lab', name: 'Computer Laboratory', imageUrl: CAMPUS_BUILDING }
];

const ADMISSION_NEWS_TITLE =
  'Sales of Online Application Form for the 2024 Admission into the College of Nursing Sciences, Muslim Medical Foundation, Saki, Oyo State';

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'admission-form-sales-general',
    category: 'General News',
    title: ADMISSION_NEWS_TITLE,
    publishedAt: '2026-07-21',
    imageUrl: STUDENTS_PHOTO,
    route: '/media'
  },
  {
    id: 'admission-form-sales-research',
    category: 'Research',
    title: ADMISSION_NEWS_TITLE,
    publishedAt: '2026-07-21',
    imageUrl: STUDENTS_PHOTO,
    route: '/media'
  },
  {
    id: 'admission-form-sales-notice',
    category: 'General News',
    title: ADMISSION_NEWS_TITLE,
    publishedAt: '2026-07-21',
    imageUrl: STUDENTS_PHOTO,
    route: '/media'
  }
];

export const QUICK_LINKS: FooterLink[] = [
  { label: 'About Us', route: '/about', href: null },
  { label: 'Admissions', route: '/admissions', href: null },
  { label: 'Media', route: '/media', href: null },
  { label: 'Contact Us', route: '/contact', href: null }
];

export const CONTACT_DETAILS: ContactDetails = {
  address:
    'College of Nursing Sciences, Muslim Medical Foundation, Ogbooro Road, PMB. 004, Saki, Oyo State, Nigeria.',
  phoneNumbers: ['+234 813 728 4147', '+234 802 214 8929'],
  email: null
};

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Facebook', icon: 'pi-facebook', href: 'https://facebook.com' },
  { label: 'YouTube', icon: 'pi-youtube', href: 'https://youtube.com' },
  { label: 'LinkedIn', icon: 'pi-linkedin', href: 'https://linkedin.com' }
];
