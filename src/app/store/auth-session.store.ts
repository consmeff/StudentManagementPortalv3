import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { LoginResponse } from '../data/auth/auth.data';

type AuthSessionState = {
  name: string;
  userType: string;
  matriculationNo: string;
  applicationNo: string;
  paymentStatus: string;
};

const initialAuthSessionState: AuthSessionState = {
  name: '',
  userType: '',
  matriculationNo: '',
  applicationNo: '',
  paymentStatus: '',
};

export const AuthSessionStore = signalStore(
  { providedIn: 'root' },
  withState(initialAuthSessionState),
  withMethods((store) => ({
    setSessionFromLogin(response: LoginResponse) {
      patchState(store, {
        name: response.name ?? '',
        userType: response.user_type ?? '',
        matriculationNo: response.matriculation_no ?? '',
        applicationNo: response.application_no ?? '',
        paymentStatus: response.payment_status ?? '',
      });
    },
    clear() {
      patchState(store, initialAuthSessionState);
    },
  }))
);
