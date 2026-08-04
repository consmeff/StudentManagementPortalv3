/**
 * Router navigation state flag set when login bounces an unverified account to the OTP page,
 * so the OTP page can explain the redirect instead of looking like a random jump.
 */
export const PENDING_VERIFICATION_REDIRECT_REASON = 'pending_verification';
