import { effect } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { LoginResponse } from '../data/auth/auth.data';

type AuthSessionState = {
  name: string;
  userType: string;
  matriculationNo: string;
  applicationNo: string;
  paymentStatus: string;
  jwtToken: string;
  refreshToken: string;
  profileEmail: string;
  authFlow: '' | 'signup_verification' | 'password_reset';
  forgotOtp: string;
  paymentRef: string;
  registrationComplete: boolean;
};

const initialAuthSessionState: AuthSessionState = {
  name: '',
  userType: '',
  matriculationNo: '',
  applicationNo: '',
  paymentStatus: '',
  jwtToken: '',
  refreshToken: '',
  profileEmail: '',
  authFlow: '',
  forgotOtp: '',
  paymentRef: '',
  registrationComplete: false,
};

const AUTH_SESSION_COOKIE_KEY = 'auth_session_store';

function clearAuthSessionCookie(): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.cookie = `${AUTH_SESSION_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function writeAuthSessionCookie(state: AuthSessionState): void {
  if (typeof document === 'undefined') {
    return;
  }

  const hasMeaningfulState = !!(
    state.jwtToken ||
    state.refreshToken ||
    state.applicationNo ||
    state.profileEmail ||
    state.paymentStatus
  );

  if (!hasMeaningfulState) {
    clearAuthSessionCookie();
    return;
  }

  const serialized = encodeURIComponent(JSON.stringify(state));
  document.cookie = `${AUTH_SESSION_COOKIE_KEY}=${serialized}; Path=/; SameSite=Lax`;
}

function readAuthSessionCookie(): AuthSessionState | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const rawCookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${AUTH_SESSION_COOKIE_KEY}=`));

  if (!rawCookie) {
    return null;
  }

  try {
    const encodedValue = rawCookie.split('=').slice(1).join('=');
    const parsed = JSON.parse(decodeURIComponent(encodedValue)) as Partial<AuthSessionState>;
    return {
      ...initialAuthSessionState,
      ...parsed,
      registrationComplete: !!parsed.registrationComplete,
    };
  } catch {
    return null;
  }
}

export const AuthSessionStore = signalStore(
  { providedIn: 'root' },
  withState(initialAuthSessionState),
  withMethods((store) => ({
    setSessionFromLogin(response: LoginResponse) {
      const nextState: AuthSessionState = {
        ...initialAuthSessionState,
        name: response.name ?? '',
        userType: response.user_type ?? '',
        matriculationNo: response.matriculation_no ?? '',
        applicationNo: response.application_no ?? '',
        paymentStatus: response.payment_status ?? '',
        jwtToken: response.access_token ?? '',
        refreshToken: response.refresh_token ?? '',
      };
      patchState(store, nextState);
    },
    setTokens(jwtToken: string, refreshToken: string) {
      patchState(store, { jwtToken: jwtToken ?? '', refreshToken: refreshToken ?? '' });
    },
    setJwtToken(jwtToken: string) {
      patchState(store, { jwtToken: jwtToken ?? '' });
    },
    setApplicationNo(applicationNo: string) {
      patchState(store, { applicationNo: applicationNo ?? '' });
    },
    setMatriculationNo(matriculationNo: string) {
      patchState(store, { matriculationNo: matriculationNo ?? '' });
    },
    setUserType(userType: string) {
      patchState(store, { userType: userType ?? '' });
    },
    setName(name: string) {
      patchState(store, { name: name ?? '' });
    },
    setPaymentStatus(paymentStatus: string) {
      patchState(store, { paymentStatus: paymentStatus ?? '' });
    },
    setPaymentRef(paymentRef: string) {
      patchState(store, { paymentRef: paymentRef ?? '' });
    },
    setRegistrationComplete(registrationComplete: boolean) {
      patchState(store, { registrationComplete: !!registrationComplete });
    },
    startSignupVerificationFlow(profileEmail: string) {
      patchState(store, { profileEmail: profileEmail ?? '', authFlow: 'signup_verification', forgotOtp: '' });
    },
    startPasswordResetFlow(profileEmail: string) {
      patchState(store, { profileEmail: profileEmail ?? '', authFlow: 'password_reset', forgotOtp: '' });
    },
    setForgotOtp(otp: string) {
      patchState(store, { forgotOtp: otp ?? '' });
    },
    clearAuthFlow() {
      patchState(store, { authFlow: '', forgotOtp: '' });
    },
    clearForgotOtp() {
      patchState(store, { forgotOtp: '' });
    },
    clear() {
      patchState(store, initialAuthSessionState);
    },
  })),
  withHooks({
    onInit(store) {
      const persisted = readAuthSessionCookie();
      if (persisted) {
        patchState(store, persisted);
      }

      effect(() => {
        const snapshot: AuthSessionState = {
          name: store.name(),
          userType: store.userType(),
          matriculationNo: store.matriculationNo(),
          applicationNo: store.applicationNo(),
          paymentStatus: store.paymentStatus(),
          jwtToken: store.jwtToken(),
          refreshToken: store.refreshToken(),
          profileEmail: store.profileEmail(),
          authFlow: store.authFlow(),
          forgotOtp: store.forgotOtp(),
          paymentRef: store.paymentRef(),
          registrationComplete: store.registrationComplete(),
        };
        writeAuthSessionCookie(snapshot);
      });
    },
  })
);
