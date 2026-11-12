import { HttpErrorResponse } from '@angular/common/http';
import { HTTP_ERROR_MESSAGE_KEYS } from '../constants/http-error.constants';

export function resolveHttpErrorMessage(error: unknown, fallbackMessage: string): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallbackMessage;
  }
  return readErrorMessage(toRecord(error.error)) ?? error.message ?? fallbackMessage;
}

function readErrorMessage(source: Record<string, unknown>): string | null {
  for (const key of HTTP_ERROR_MESSAGE_KEYS) {
    const message = readFirstText(source[key]);
    if (message) {
      return message;
    }
  }
  return null;
}

function readFirstText(value: unknown): string | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (typeof candidate !== 'string') {
    return null;
  }
  return candidate.trim() || null;
}

function toRecord(value: unknown): Record<string, unknown> {
  const isPlainRecord = value !== null && typeof value === 'object' && !Array.isArray(value);
  return isPlainRecord ? (value as Record<string, unknown>) : {};
}
