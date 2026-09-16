import { AUTH_RETURN_URL_BLOCKED_PREFIX } from '../constants/auth.constants';

const INTERNAL_PATH_PREFIX = '/';
const PROTOCOL_RELATIVE_PREFIX = '//';
const BACKSLASH = '\\';

export function resolveSafeReturnUrl(candidateUrl: string | null): string | null {
  const trimmedUrl = candidateUrl?.trim() ?? '';

  const isInternalPath = trimmedUrl.startsWith(INTERNAL_PATH_PREFIX)
    && !trimmedUrl.startsWith(PROTOCOL_RELATIVE_PREFIX)
    && !trimmedUrl.includes(BACKSLASH);
  if (!isInternalPath || trimmedUrl.startsWith(AUTH_RETURN_URL_BLOCKED_PREFIX)) {
    return null;
  }

  return trimmedUrl;
}
