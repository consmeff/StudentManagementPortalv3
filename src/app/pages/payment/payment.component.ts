import { HttpResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { WidgetsService } from '../../widgets/services/widgets.service';
import { ApplicationService } from '../../services/application.service';
import { TraceabilityModule } from '../../shared/traceability.module';
import { sidebarStateDTO } from '../../data/dashboard/dash.dto';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { PaymentHistoryItem } from '../../data/application/payment.data';
import { AuthSessionStore } from '../../store/auth-session.store';

const PAYMENT_PAGE_CONFIG = {
  currencyCode: 'NGN',
  currencyLocale: 'en-NG',
  dateLocale: 'en-GB',
  defaultReceiptExtension: 'pdf'
} as const;

const PAYMENT_STATUS_CLASS = {
  completed: 'status-pill--completed',
  failed: 'status-pill--failed',
  pending: 'status-pill--pending',
  default: 'status-pill--default'
} as const;

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    TraceabilityModule,
    ButtonComponent
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  private readonly authSessionStore = inject(AuthSessionStore);

  sidebarVisible = false;
  isLoading = false;
  activeReceiptRefId: string | null = null;
  paymentHistory: PaymentHistoryItem[] = [];
  totalPayments = 0;
  nextPageUrl: string | null = null;
  previousPageUrl: string | null = null;
  currentPage = 1;
  totalPages = 1;

  constructor(
    private readonly widgetService: WidgetsService,
    private readonly appService: ApplicationService,
    private readonly destroyRef: DestroyRef
  ) {
    this.widgetService.sidebarState$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state: sidebarStateDTO) => {
        this.sidebarVisible = state.isvisible;
      });
  }

  ngOnInit(): void {
    void this.loadPaymentHistory();
  }

  async loadPaymentHistory(pageUrl: string | null = null): Promise<void> {
    this.isLoading = true;
    try {
      const response = await firstValueFrom(this.appService.getPayments(pageUrl ?? undefined));
      this.paymentHistory = response.results;
      this.totalPayments = response.count;
      this.nextPageUrl = response.next;
      this.previousPageUrl = response.previous;
      this.updatePaginationState(response.count, response.results.length, response.next, response.previous);
    } catch {
      this.totalPayments = 0;
      this.paymentHistory = [];
      this.nextPageUrl = null;
      this.previousPageUrl = null;
      this.currentPage = 1;
      this.totalPages = 1;
    } finally {
      this.isLoading = false;
    }
  }

  async downloadReceipt(item: PaymentHistoryItem): Promise<void> {
    const referenceId = item.ref_id.trim();
    if (!referenceId) {
      this.downloadFallbackReceipt(item);
      return;
    }

    this.activeReceiptRefId = referenceId;
    try {
      const paymentDetail = await firstValueFrom(this.appService.getPayment(referenceId));
      const receiptResponse = await firstValueFrom(this.appService.getPaymentReceipt(referenceId));
      const receiptOpened = await this.openReceiptResponse(receiptResponse, paymentDetail);

      if (!receiptOpened) {
        this.downloadFallbackReceipt(paymentDetail);
      }
    } finally {
      this.activeReceiptRefId = null;
    }
  }

  formatDate(value: string): string {
    if (!value) {
      return '—';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }

    return date.toLocaleDateString(PAYMENT_PAGE_CONFIG.dateLocale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatCurrency(amount: number | null): string {
    if (amount === null) {
      return '—';
    }

    return new Intl.NumberFormat(PAYMENT_PAGE_CONFIG.currencyLocale, {
      style: 'currency',
      currency: PAYMENT_PAGE_CONFIG.currencyCode,
      maximumFractionDigits: 2
    }).format(amount);
  }

  paymentStatusClass(status: string): string {
    const normalizedStatus = status.toLowerCase().trim();
    if (normalizedStatus.includes('complete') || normalizedStatus.includes('success') || normalizedStatus.includes('paid')) {
      return PAYMENT_STATUS_CLASS.completed;
    }
    if (normalizedStatus.includes('fail') || normalizedStatus.includes('cancel')) {
      return PAYMENT_STATUS_CLASS.failed;
    }
    if (normalizedStatus.includes('pending') || normalizedStatus.includes('processing')) {
      return PAYMENT_STATUS_CLASS.pending;
    }
    return PAYMENT_STATUS_CLASS.default;
  }

  isReceiptLoading(refId: string): boolean {
    return this.activeReceiptRefId === refId;
  }

  canGoToPreviousPage(): boolean {
    return this.previousPageUrl !== null && !this.isLoading;
  }

  canGoToNextPage(): boolean {
    return this.nextPageUrl !== null && !this.isLoading;
  }

  loadPreviousPage(): void {
    if (!this.canGoToPreviousPage()) {
      return;
    }

    void this.loadPaymentHistory(this.previousPageUrl);
  }

  loadNextPage(): void {
    if (!this.canGoToNextPage()) {
      return;
    }

    void this.loadPaymentHistory(this.nextPageUrl);
  }

  private updatePaginationState(
    totalPayments: number,
    currentResultCount: number,
    nextPageUrl: string | null,
    previousPageUrl: string | null
  ): void {
    const nextPageNumber = this.extractPageNumber(nextPageUrl);
    const previousPageNumber = this.extractPageNumber(previousPageUrl);
    const resolvedPageSize = currentResultCount > 0 ? currentResultCount : totalPayments;

    if (nextPageNumber !== null) {
      this.currentPage = Math.max(nextPageNumber - 1, 1);
    } else if (previousPageNumber !== null) {
      this.currentPage = previousPageNumber + 1;
    } else {
      this.currentPage = 1;
    }

    if (resolvedPageSize > 0) {
      this.totalPages = Math.max(Math.ceil(totalPayments / resolvedPageSize), 1);
      return;
    }

    this.totalPages = 1;
  }

  private extractPageNumber(url: string | null): number | null {
    if (!url) {
      return null;
    }

    try {
      const baseUrl = globalThis.location?.origin ?? 'http://localhost';
      const parsedUrl = new URL(url, baseUrl);
      const pageValue = parsedUrl.searchParams.get('page');
      if (!pageValue) {
        return null;
      }

      const pageNumber = Number(pageValue);
      return Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : null;
    } catch {
      return null;
    }
  }

  private async openReceiptResponse(
    response: HttpResponse<Blob>,
    payment: PaymentHistoryItem
  ): Promise<boolean> {
    const receiptBody = response.body;
    if (!receiptBody || receiptBody.size === 0) {
      return false;
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (this.isTextLikeContent(contentType)) {
      const payloadText = (await receiptBody.text()).trim();
      const receiptUrl = this.extractReceiptUrl(this.parseJsonSafely(payloadText)) ?? this.extractReceiptUrl(payloadText);

      if (receiptUrl) {
        this.openExternalUrl(receiptUrl);
        return true;
      }

      return false;
    }

    const fileName = this.extractReceiptFileName(response, payment.ref_id);
    this.downloadBlob(receiptBody, fileName);
    return true;
  }

  private parseJsonSafely(value: string): unknown {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  private extractReceiptUrl(value: unknown): string | null {
    if (typeof value === 'string') {
      return this.isValidUrl(value) ? value : null;
    }

    if (!this.isRecord(value)) {
      return null;
    }

    const receiptKeys = ['receipt_url', 'file_url', 'url', 'download_url', 'receipt'];
    for (const receiptKey of receiptKeys) {
      const receiptValue = value[receiptKey];
      if (typeof receiptValue === 'string' && this.isValidUrl(receiptValue)) {
        return receiptValue;
      }
    }

    return 'data' in value ? this.extractReceiptUrl(value['data']) : null;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }

  private isTextLikeContent(contentType: string): boolean {
    return contentType.includes('application/json')
      || contentType.includes('text/plain')
      || contentType.includes('text/html');
  }

  private isValidUrl(value: string): boolean {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return false;
    }

    try {
      const parsedUrl = new URL(trimmedValue);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private extractReceiptFileName(response: HttpResponse<Blob>, referenceId: string): string {
    const contentDisposition = response.headers.get('content-disposition') ?? '';
    const matchedFileName = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
    if (matchedFileName?.[1]) {
      return decodeURIComponent(matchedFileName[1].replace(/"/g, '').trim());
    }

    return `payment-receipt-${referenceId}.${PAYMENT_PAGE_CONFIG.defaultReceiptExtension}`;
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private downloadFallbackReceipt(item: PaymentHistoryItem): void {
    const receiptText = [
      'Payment Receipt',
      `Date: ${this.formatDate(item.created_at)}`,
      `Applicant: ${item.applicant_name || '—'}`,
      `Applicant No: ${item.applicant_no || this.authSessionStore.applicationNo() || '—'}`,
      `Payment Type: ${item.payment_type || '—'}`,
      `Reference Number: ${item.ref_id || this.authSessionStore.paymentRef() || '—'}`,
      `Amount: ${this.formatCurrency(item.amount)}`,
      `Amount Paid: ${this.formatCurrency(item.amount_paid)}`,
      `Status: ${item.status || '—'}`,
      `Summary: ${item.summary || '—'}`
    ].join('\n');

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    this.downloadBlob(blob, `payment-receipt-${item.ref_id || 'record'}.txt`);
  }

  private openExternalUrl(url: string): void {
    globalThis.open?.(url, '_blank', 'noopener,noreferrer');
  }
}
