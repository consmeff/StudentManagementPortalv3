import { UrlMatchResult, UrlSegment } from '@angular/router';

import { PAYMENT_RECEIPT_CONFIG } from '../constants/payment-receipt.constants';

export function buildPaymentReceiptVerificationPath(referenceId: string): string {
  const query = new URLSearchParams({ [PAYMENT_RECEIPT_CONFIG.referenceQueryParam]: referenceId });
  return `/${PAYMENT_RECEIPT_CONFIG.routePath}/?${query.toString()}`;
}

export function matchPaymentReceiptVerificationRoute(segments: UrlSegment[]): UrlMatchResult | null {
  const [firstSegment, ...trailingSegments] = segments;
  const isVerificationPath = firstSegment?.path === PAYMENT_RECEIPT_CONFIG.routePath
    && trailingSegments.every((segment) => segment.path.length === 0);

  return isVerificationPath ? { consumed: segments } : null;
}
