import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

const INTERCEPTOR_SUMMARIES = {
  network: 'Network Error',
  unauthorized: 'Unauthorized',
  forbidden: 'Forbidden',
  notFound: 'Not Found',
  server: 'Server Error',
  fallback: 'Request Failed'
} as const;

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const messageService = inject(MessageService);
  const skipErrorToast = request.headers.has('X-Skip-Error-Toast');

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!skipErrorToast) {
        const message = buildErrorMessage(error);
        messageService.add({
          severity: 'error',
          summary: buildErrorSummary(error),
          detail: message
        });
      }

      return throwError(() => error);
    })
  );
};

function buildErrorSummary(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return INTERCEPTOR_SUMMARIES.fallback;
  }

  if (error.status === 0) {
    return INTERCEPTOR_SUMMARIES.network;
  }
  if (error.status === 401) {
    return INTERCEPTOR_SUMMARIES.unauthorized;
  }
  if (error.status === 403) {
    return INTERCEPTOR_SUMMARIES.forbidden;
  }
  if (error.status === 404) {
    return INTERCEPTOR_SUMMARIES.notFound;
  }
  if (error.status >= 500) {
    return INTERCEPTOR_SUMMARIES.server;
  }

  return INTERCEPTOR_SUMMARIES.fallback;
}

function buildErrorMessage(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return 'An unexpected error occurred. Please try again.';
  }

  if (error.status === 0) {
    return 'Unable to reach the server. Check your network and try again.';
  }

  if (typeof error.error === 'string' && error.error.trim().length > 0) {
    return error.error.trim();
  }

  const objectMessage = extractObjectMessage(error.error);
  if (objectMessage) {
    return objectMessage;
  }

  if (error.message.trim().length > 0) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

function extractObjectMessage(value: unknown): string | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;
  const preferredKeys = ['message', 'detail', 'error', 'title', 'non_field_errors', 'errors'] as const;

  for (const key of preferredKeys) {
    const currentValue = record[key];
    const extractedMessage = collectMessages(currentValue)[0];
    if (extractedMessage) {
      return extractedMessage;
    }
  }

  const fallbackMessages = collectMessages(value);
  return fallbackMessages.length > 0 ? fallbackMessages[0] : null;
}

function collectMessages(value: unknown): string[] {
  const messages: string[] = [];
  collectMessagesRecursively(value, messages);
  return Array.from(new Set(messages));
}

function collectMessagesRecursively(value: unknown, messages: string[]): void {
  if (messages.length >= 6 || value == null) {
    return;
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (trimmedValue.length > 0) {
      messages.push(trimmedValue);
    }
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectMessagesRecursively(item, messages);
      if (messages.length >= 6) {
        return;
      }
    }
    return;
  }

  if (typeof value !== 'object') {
    return;
  }

  for (const childValue of Object.values(value as Record<string, unknown>)) {
    collectMessagesRecursively(childValue, messages);
    if (messages.length >= 6) {
      return;
    }
  }
}
