import { HttpResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  defaultReceiptExtension: 'pdf',
  defaultPageNumber: 1,
  pageQueryParam: 'page',
  orderingQueryParam: 'ordering',
  searchQueryParam: 'search'
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

  sidebarVisible: boolean = false;
  isLoading: boolean = false;
  activeReceiptRefId: string | null = null;
  paymentHistory: PaymentHistoryItem[] = [];
  totalPayments: number = 0;
  nextPage: boolean = false;
  previousPage: boolean = false;
  currentPage: number = PAYMENT_PAGE_CONFIG.defaultPageNumber;
  totalPages: number | null = null;
  currentOrdering: string | null = null;
  currentSearch: string | null = null;
  knownPageSize: number | null = null;

  constructor(
    private readonly widgetService: WidgetsService,
    private readonly appService: ApplicationService,
    private readonly destroyRef: DestroyRef,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.widgetService.sidebarState$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state: sidebarStateDTO) => {
        this.sidebarVisible = state.isvisible;
      });
  }

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((queryParams) => {
        const pageNumber = this.parsePageNumber(queryParams.get(PAYMENT_PAGE_CONFIG.pageQueryParam));
        const ordering = this.normalizeQueryValue(queryParams.get(PAYMENT_PAGE_CONFIG.orderingQueryParam));
        const search = this.normalizeQueryValue(queryParams.get(PAYMENT_PAGE_CONFIG.searchQueryParam));

        this.currentPage = pageNumber;
        this.currentOrdering = ordering;
        this.currentSearch = search;
        void this.loadPaymentHistory(pageNumber, ordering, search);
      });
  }

  async loadPaymentHistory(pageNumber: number, ordering: string | null, search: string | null): Promise<void> {
    this.isLoading = true;
    try {
      const response = await firstValueFrom(this.appService.getPayments({
        page: pageNumber,
        ordering,
        search
      }));
      this.paymentHistory = response.results;
      this.totalPayments = response.count;
      this.nextPage = response.next !== null;
      this.previousPage = response.previous !== null;
      this.updatePaginationState(response.count, response.results.length, response.next !== null, response.previous !== null);
    } catch {
      this.totalPayments = 0;
      this.paymentHistory = [];
      this.nextPage = false;
      this.previousPage = false;
      this.totalPages = null;
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
    return this.previousPage && !this.isLoading;
  }

  canGoToNextPage(): boolean {
    return this.nextPage && !this.isLoading;
  }

  loadPreviousPage(): void {
    if (!this.canGoToPreviousPage()) {
      return;
    }

    void this.navigateToPage(this.currentPage - 1);
  }

  loadNextPage(): void {
    if (!this.canGoToNextPage()) {
      return;
    }

    void this.navigateToPage(this.currentPage + 1);
  }

  private updatePaginationState(
    totalPayments: number,
    currentResultCount: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  ): void {
    if (currentResultCount > 0 && hasNextPage) {
      this.knownPageSize = currentResultCount;
    }

    if (totalPayments === 0) {
      this.totalPages = null;
      return;
    }

    if (!hasNextPage && !hasPreviousPage) {
      this.totalPages = PAYMENT_PAGE_CONFIG.defaultPageNumber;
      this.knownPageSize = currentResultCount > 0 ? currentResultCount : this.knownPageSize;
      return;
    }

    if (this.knownPageSize !== null && this.knownPageSize > 0) {
      this.totalPages = Math.max(Math.ceil(totalPayments / this.knownPageSize), PAYMENT_PAGE_CONFIG.defaultPageNumber);
      return;
    }

    this.totalPages = null;
  }

  private parsePageNumber(pageValue: string | null): number {
    if (!pageValue) {
      return PAYMENT_PAGE_CONFIG.defaultPageNumber;
    }

    const pageNumber = Number(pageValue);
    return Number.isFinite(pageNumber) && pageNumber > 0
      ? Math.trunc(pageNumber)
      : PAYMENT_PAGE_CONFIG.defaultPageNumber;
  }

  private normalizeQueryValue(value: string | null): string | null {
    return value && value.trim().length > 0 ? value.trim() : null;
  }

  private async navigateToPage(pageNumber: number): Promise<void> {
    const resolvedPageNumber = Math.max(pageNumber, PAYMENT_PAGE_CONFIG.defaultPageNumber);
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [PAYMENT_PAGE_CONFIG.pageQueryParam]: resolvedPageNumber,
        [PAYMENT_PAGE_CONFIG.orderingQueryParam]: this.currentOrdering,
        [PAYMENT_PAGE_CONFIG.searchQueryParam]: this.currentSearch
      },
      queryParamsHandling: 'merge'
    });
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
