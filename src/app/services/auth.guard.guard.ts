// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { jwtDecode } from 'jwt-decode';   // npm i jwt-decode
import { AuthSessionStore } from '../store/auth-session.store';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const router = inject(Router);
  const authSessionStore = inject(AuthSessionStore);

  const token = authSessionStore.jwtToken();

  if (!token) {
    return router.createUrlTree(['/auth/login']);
  }

  try {
    const { exp } = jwtDecode<{ exp: number }>(token);

    if (!exp || Date.now() >= exp * 1000) {
      return router.createUrlTree(['/auth/login']);
    }

    return true;          // token is still valid
  } catch {
    return router.createUrlTree(['/auth/login']); // malformed token
  }
};
