import { effect } from '@angular/core';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { LoginResponse } from '../data/auth/auth.data';
import { RegistrantData } from '../data/application/registrantdatadto';
import { normalizeDisplayName } from '../utility/name-format';

type AuthSessionState = {
  name: string;
  userType: string;
  matriculationNo: string;
  applicationNo: string;
  paymentStatus: string;
  acceptanceFeeStatus: string;
  isAdmitted: boolean;
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
  acceptanceFeeStatus: '',
  isAdmitted: false,
  jwtToken: '',
  refreshToken: '',
  profileEmail: '',
  authFlow: '',
  forgotOtp: '',
  paymentRef: '',
  registrationComplete: false,
};

const AUTH_SESSION_COOKIE_KEY = 'auth_session_store';

type PortalSessionStateUpdate = {
  userType?: string | null;
  matriculationNo?: string | null;
  applicationNo?: string | null;
  paymentStatus?: string | null;
  acceptanceFeeStatus?: string | null;
  isAdmitted?: boolean | null;
};

function normalizeSessionValue(value: string | null | undefined): string {
  return value ?? '';
}

function hasPaidStatus(status: string | null | undefined): boolean {
  const normalizedStatus = normalizeSessionValue(status).toLowerCase().trim();
  if (!normalizedStatus) {
    return false;
  }

  if (
    normalizedStatus.includes('unpaid')
    || normalizedStatus.includes('pending')
    || normalizedStatus.includes('not paid')
    || normalizedStatus.includes('fail')
  ) {
    return false;
  }

  return (
    normalizedStatus.includes('paid')
    || normalizedStatus.includes('complete')
    || normalizedStatus.includes('success')
  );
}

function buildPortalSessionPatch(update: PortalSessionStateUpdate): Partial<AuthSessionState> {
  const nextState: Partial<AuthSessionState> = {};

  if ('userType' in update) {
    nextState.userType = normalizeSessionValue(update.userType);
  }
  if ('matriculationNo' in update) {
    nextState.matriculationNo = normalizeSessionValue(update.matriculationNo);
  }
  if ('applicationNo' in update) {
    nextState.applicationNo = normalizeSessionValue(update.applicationNo);
  }
  if ('paymentStatus' in update) {
    nextState.paymentStatus = normalizeSessionValue(update.paymentStatus);
  }
  if ('acceptanceFeeStatus' in update) {
    nextState.acceptanceFeeStatus = normalizeSessionValue(update.acceptanceFeeStatus);
  }
  if ('isAdmitted' in update) {
    nextState.isAdmitted = !!update.isAdmitted;
  }

  if (
    !nextState.isAdmitted
    && 'acceptanceFeeStatus' in update
    && normalizeSessionValue(update.acceptanceFeeStatus).trim().length > 0
  ) {
    nextState.isAdmitted = true;
  }

  return nextState;
}

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
    state.paymentStatus ||
    state.acceptanceFeeStatus ||
    state.isAdmitted
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
      isAdmitted: !!parsed.isAdmitted,
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
        name: normalizeDisplayName(response.name),
        jwtToken: response.access_token ?? '',
        refreshToken: response.refresh_token ?? '',
        ...buildPortalSessionPatch({
          userType: response.user_type,
          matriculationNo: response.matriculation_no,
          applicationNo: response.application_no,
          paymentStatus: response.payment_status,
          acceptanceFeeStatus: response.acceptance_fee_status,
          isAdmitted: response.is_admitted,
        }),
      };
      patchState(store, nextState);
    },
    syncPortalState(update: PortalSessionStateUpdate) {
      patchState(store, buildPortalSessionPatch(update));
    },
    syncRegistrantSession(registrant: RegistrantData | null) {
      if (!registrant) {
        return;
      }

      const nextState = buildPortalSessionPatch({
        userType: registrant.user_type,
        matriculationNo: registrant.matriculation_no,
        applicationNo: registrant.application_no,
        acceptanceFeeStatus: registrant.acceptance_fee_status,
        isAdmitted: registrant.is_admitted,
      });
      const currentPaymentStatus = store.paymentStatus();
      const incomingPaymentStatus = registrant.payment_status;
      if (incomingPaymentStatus && (!hasPaidStatus(currentPaymentStatus) || hasPaidStatus(incomingPaymentStatus))) {
        nextState.paymentStatus = incomingPaymentStatus;
      }

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
      patchState(store, { name: normalizeDisplayName(name) });
    },
    setPaymentStatus(paymentStatus: string) {
      patchState(store, { paymentStatus: paymentStatus ?? '' });
    },
    setAcceptanceFeeStatus(acceptanceFeeStatus: string) {
      patchState(store, { acceptanceFeeStatus: acceptanceFeeStatus ?? '' });
    },
    setIsAdmitted(isAdmitted: boolean) {
      patchState(store, { isAdmitted: !!isAdmitted });
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
          acceptanceFeeStatus: store.acceptanceFeeStatus(),
          isAdmitted: store.isAdmitted(),
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
