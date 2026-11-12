import type { ADMITTED_PROFILE_TAB } from './admitted-profile.constants';

export type AdmittedProfileTab = (typeof ADMITTED_PROFILE_TAB)[keyof typeof ADMITTED_PROFILE_TAB];
