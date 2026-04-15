import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NavigationAccessService, ProtectedPageFeature } from './navigation-access.service';

export const featureAccessGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const access = inject(NavigationAccessService);
  const feature = route.data?.['feature'] as ProtectedPageFeature | undefined;

  if (!feature || access.canAccess(feature)) {
    return true;
  }

  return router.createUrlTree(['/pages/dashboard']);
};
