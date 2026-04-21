import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserPortalService } from './user-portal.service';

export const portalEntryGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userPortalService = inject(UserPortalService);
  return router.createUrlTree([userPortalService.dashboardUrl()]);
};
