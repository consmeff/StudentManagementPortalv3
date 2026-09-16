import { PAYMENT_PAGE_CONFIG, PAYMENT_STATUS_CLASS } from '../constants/payment-page.constants';

const EMPTY_VALUE_PLACEHOLDER = '—';

const SUCCESSFUL_STATUS_KEYWORDS = ['complete', 'success', 'paid'];
const FAILED_STATUS_KEYWORDS = ['fail', 'cancel'];
const PENDING_STATUS_KEYWORDS = ['pending', 'processing'];

export function formatPaymentDate(value: string | null): string {
  const parsedDate = parsePaymentDate(value);
  if (parsedDate === null) {
    return EMPTY_VALUE_PLACEHOLDER;
  }

  return parsedDate.toLocaleDateString(PAYMENT_PAGE_CONFIG.dateLocale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function formatPaymentDateTime(value: string | null): string {
  const parsedDate = parsePaymentDate(value);
  if (parsedDate === null) {
    return EMPTY_VALUE_PLACEHOLDER;
  }

  return parsedDate.toLocaleString(PAYMENT_PAGE_CONFIG.dateLocale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function displayPaymentValue(value: string | null): string {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : EMPTY_VALUE_PLACEHOLDER;
}

export function formatPaymentCurrency(amount: number | null): string {
  if (amount === null) {
    return EMPTY_VALUE_PLACEHOLDER;
  }

  return new Intl.NumberFormat(PAYMENT_PAGE_CONFIG.currencyLocale, {
    style: 'currency',
    currency: PAYMENT_PAGE_CONFIG.currencyCode,
    maximumFractionDigits: 2
  }).format(amount);
}

export function resolvePaymentStatusClass(status: string): string {
  const normalizedStatus = status.toLowerCase().trim();

  if (matchesAnyKeyword(normalizedStatus, SUCCESSFUL_STATUS_KEYWORDS)) {
    return PAYMENT_STATUS_CLASS.completed;
  }
  if (matchesAnyKeyword(normalizedStatus, FAILED_STATUS_KEYWORDS)) {
    return PAYMENT_STATUS_CLASS.failed;
  }
  if (matchesAnyKeyword(normalizedStatus, PENDING_STATUS_KEYWORDS)) {
    return PAYMENT_STATUS_CLASS.pending;
  }

  return PAYMENT_STATUS_CLASS.default;
}

export function isSuccessfulPaymentStatus(status: string): boolean {
  return matchesAnyKeyword(status.toLowerCase().trim(), SUCCESSFUL_STATUS_KEYWORDS);
}

function parsePaymentDate(value: string | null): Date | null {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function matchesAnyKeyword(normalizedStatus: string, keywords: ReadonlyArray<string>): boolean {
  return keywords.some((keyword) => normalizedStatus.includes(keyword));
}
