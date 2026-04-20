import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthSessionStore } from '../store/auth-session.store';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authSessionStore = inject(AuthSessionStore);
  const token = authSessionStore.jwtToken();

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
