import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { PortalSegment, UserPortalService } from './user-portal.service';

function resolveExpectedPortalSegment(route: Route, segments: UrlSegment[]): PortalSegment | null {
  const routeDataPortalSegment = route.data?.['portalSegment'];
  if (routeDataPortalSegment === 'new' || routeDataPortalSegment === 'admitted' || routeDataPortalSegment === 'returning') {
    return routeDataPortalSegment;
  }

  const firstPathSegment = segments[0]?.path ?? route.path ?? '';
  if (firstPathSegment === 'pages') {
    return 'new';
  }
  if (firstPathSegment === 'new' || firstPathSegment === 'admitted' || firstPathSegment === 'returning') {
    return firstPathSegment;
  }

  return null;
}

export const portalSegmentGuard: CanMatchFn = (route, segments) => {
  const router = inject(Router);
  const userPortalService = inject(UserPortalService);
  const expectedPortalSegment = resolveExpectedPortalSegment(route, segments);

  if (expectedPortalSegment === null || userPortalService.portalSegment() === expectedPortalSegment) {
    return true;
  }

  return router.createUrlTree([userPortalService.dashboardUrl()]);
};
