/**
 * Content models for the public marketing site.
 *
 * Every model is transport-agnostic on purpose: `PublicContentService` currently
 * resolves these from in-repo constants, but the shapes are what an eventual CMS
 * or `/public/*` API response should be normalised into, so swapping the source
 * touches only the service.
 *
 * `imageUrl` is nullable throughout. A `null` renders the neutral placeholder in
 * `app-public-image` instead of a broken image, which lets sections ship before
 * their photography does.
 */

export interface HeroContent {
  titleLines: string[];
  subtitle: string;
  ctaLabel: string;
  ctaRoute: string;
  imageUrl: string | null;
  imageAlt: string;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
}

export interface DirectorsSpeech {
  heading: string;
  paragraphs: string[];
  readMoreRoute: string;
  portraitUrl: string | null;
  portraitAlt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl: string | null;
}

export interface Programme {
  id: string;
  name: string;
  /** Route to the programme detail page; null until those pages exist. */
  route: string | null;
}

export interface Facility {
  id: string;
  name: string;
  imageUrl: string | null;
}

export interface NewsArticle {
  id: string;
  category: string;
  title: string;
  /** ISO-8601 date string; formatted for display at the edge. */
  publishedAt: string;
  imageUrl: string | null;
  route: string;
}

export interface FooterLink {
  label: string;
  route: string | null;
  href: string | null;
}

export interface ContactDetails {
  address: string;
  phoneNumbers: string[];
  email: string | null;
}

export interface SocialLink {
  label: string;
  /** PrimeIcons class, e.g. `pi-facebook`. */
  icon: string;
  href: string;
}

export interface SiteIdentity {
  institutionName: string;
  foundationName: string;
  aboutBlurb: string;
  copyrightHolder: string;
}
