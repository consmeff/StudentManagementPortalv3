/**
 * Primary navigation for the public site.
 *
 * Shared by the header and the footer's Quick Links so the two can never drift.
 * Keep in step with the child routes in `public.routes.ts`.
 */
export interface PublicNavItem {
  label: string;
  route: string;
}

export const PUBLIC_NAV_ITEMS: PublicNavItem[] = [
  { label: 'About', route: '/about' },
  { label: 'Programmes', route: '/programmes' },
  { label: 'Admissions', route: '/admissions' },
  { label: 'Media', route: '/media' },
  { label: 'Contact Us', route: '/contact' }
];
