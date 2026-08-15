import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout.component';

const SITE_SUFFIX = 'College of Nursing Sciences, Muslim Medical Foundation';

/**
 * Routes for the public (unauthenticated) marketing site.
 *
 * Imported eagerly by `appRoutes` rather than lazy-loaded via `loadChildren`.
 * The public shell and the portal shell both sit at the empty path, so the
 * router relies on backtracking — matching this config, failing to match a
 * child, then falling through to the portal route for `/new`, `/admitted`,
 * `/returning`, `/pages` and `/portal`. Keeping the route table synchronous
 * makes that fall-through plain config iteration with no chunk loading in the
 * matching path. Individual pages are still code-split via `loadComponent`.
 *
 * Consequence: any new top-level portal path must NOT collide with a child path
 * here, and vice versa.
 */
export const publicRoutes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: SITE_SUFFIX,
        loadComponent: () => import('./pages/landing/landing.component').then((m) => m.LandingComponent)
      },
      {
        path: 'about',
        title: `About Us | ${SITE_SUFFIX}`,
        loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent)
      },
      {
        path: 'programmes',
        title: `Programmes | ${SITE_SUFFIX}`,
        loadComponent: () =>
          import('./pages/programmes/programmes-page.component').then((m) => m.ProgrammesPageComponent)
      },
      {
        path: 'admissions',
        title: `Admissions | ${SITE_SUFFIX}`,
        loadComponent: () => import('./pages/admissions/admissions.component').then((m) => m.AdmissionsComponent)
      },
      {
        path: 'media',
        title: `Media | ${SITE_SUFFIX}`,
        loadComponent: () => import('./pages/media/media.component').then((m) => m.MediaComponent)
      },
      {
        path: 'contact',
        title: `Contact Us | ${SITE_SUFFIX}`,
        loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent)
      }
    ]
  }
];
