import { HttpResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, Inject, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EMPTY, Observable, from, of } from 'rxjs';
import { catchError, distinctUntilChanged, finalize, map, switchMap, take, tap } from 'rxjs/operators';

import {
  PAYMENT_PAGE_CONFIG,
  PAYMENT_RECEIPT_KEYS,
  PAYMENT_STATUS_CLASS,
  PAYMENT_TABLE_COLUMNS,
  PAYMENT_TABLE_GRID_TEMPLATE
} from '../../constants/payment-page.constants';
import { PaginatedPaymentsResponse, PaymentHistoryItem } from '../../data/application/payment.data';
import { AuthSessionStore } from '../../store/auth-session.store';
import { WidgetsService } from '../../widgets/services/widgets.service';
import { ApplicationService } from '../../services/application.service';
import { TraceabilityModule } from '../../shared/traceability.module';
import { sidebarStateDTO } from '../../data/dashboard/dash.dto';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

type TAuthSessionStore = {
  applicationNo: () => string;
  paymentRef: () => string;
};

type TPaymentQueryState = {
  pageNumber: number;
  ordering: string | null;
  search: string | null;
};

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    TraceabilityModule,
    ButtonComponent,
    DataTableComponent,
    PaginationComponent
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  readonly sidebarVisible = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);
  readonly activeReceiptRefId = signal<string | null>(null);
  readonly paymentHistory = signal<PaymentHistoryItem[]>([]);
  readonly totalPayments = signal<number>(0);
  readonly currentPage = signal<number>(PAYMENT_PAGE_CONFIG.defaultPageNumber);
  readonly totalPages = signal<number | null>(null);
  readonly currentOrdering = signal<string | null>(null);
  readonly currentSearch = signal<string | null>(null);
  readonly pageSize = signal<number>(0);
  readonly totalRecordsLabel = computed(() => this.resolveTotalRecordsLabel());
  readonly pageLabel = computed(() => this.resolvePageLabel());
  readonly showPageSummary = computed(() => !this.isLoading() && this.paymentHistory().length > 0);
  readonly showPagination = computed(() => !this.isLoading() && this.paymentHistory().length > 0 && this.totalPages() !== null);
  readonly paymentTableColumns = PAYMENT_TABLE_COLUMNS;
  readonly paymentTableGridTemplate = PAYMENT_TABLE_GRID_TEMPLATE;

  constructor(
    @Inject(AuthSessionStore) private readonly authSessionStore: TAuthSessionStore,
    private readonly widgetService: WidgetsService,
    private readonly appService: ApplicationService,
    private readonly destroyRef: DestroyRef,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.observeSidebarState();
    this.observePaymentQueryState();
  }

  downloadReceipt(item: PaymentHistoryItem): void {
    const referenceId = item.ref_id.trim();
    if (!referenceId) {
      this.downloadFallbackReceipt(item);
      return;
    }

    this.activeReceiptRefId.set(referenceId);
    this.appService.getPayment(referenceId).pipe(
      take(1),
      switchMap((paymentDetail) =>
        this.appService.getPaymentReceipt(referenceId).pipe(
          take(1),
          switchMap((receiptResponse) =>
            this.resolveReceiptResponse(receiptResponse, paymentDetail).pipe(
              tap((receiptOpened) => {
                if (!receiptOpened) {
                  this.downloadFallbackReceipt(paymentDetail);
                }
              })
            )
          )
        )
      ),
      catchError(() => {
        this.downloadFallbackReceipt(item);
        return EMPTY;
      }),
      finalize(() => {
        this.activeReceiptRefId.set(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
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
    return this.activeReceiptRefId() === refId;
  }

  trackPaymentRow(index: number, item: PaymentHistoryItem): string {
    return item.ref_id || `${index}`;
  }

  goToPage(pageNumber: number): void {
    this.navigateToPage(pageNumber);
  }

  private observeSidebarState(): void {
    this.widgetService.sidebarState$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((state: sidebarStateDTO) => {
      this.sidebarVisible.set(state.isvisible);
    });
  }

  private observePaymentQueryState(): void {
    this.route.queryParamMap.pipe(
      map((queryParams) => this.mapQueryState(queryParams)),
      distinctUntilChanged((previousState, currentState) =>
        previousState.pageNumber === currentState.pageNumber
        && previousState.ordering === currentState.ordering
        && previousState.search === currentState.search
      ),
      tap((queryState) => {
        this.currentPage.set(queryState.pageNumber);
        this.currentOrdering.set(queryState.ordering);
        this.currentSearch.set(queryState.search);
        this.isLoading.set(true);
      }),
      switchMap((queryState) =>
        this.appService.getPayments({
          page: queryState.pageNumber,
          ordering: queryState.ordering,
          search: queryState.search
        }).pipe(
          tap((response) => this.applyPaymentResponse(response)),
          catchError(() => {
            this.resetPaymentState();
            return EMPTY;
          }),
          finalize(() => {
            this.isLoading.set(false);
          })
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private mapQueryState(queryParams: ParamMap): TPaymentQueryState {
    return {
      pageNumber: this.parsePageNumber(queryParams.get(PAYMENT_PAGE_CONFIG.pageQueryParam)),
      ordering: this.normalizeQueryValue(queryParams.get(PAYMENT_PAGE_CONFIG.orderingQueryParam)),
      search: this.normalizeQueryValue(queryParams.get(PAYMENT_PAGE_CONFIG.searchQueryParam))
    };
  }

  private applyPaymentResponse(response: PaginatedPaymentsResponse): void {
    this.paymentHistory.set(response.results);
    this.totalPayments.set(response.count);
    this.updatePaginationState(response.count, response.results.length, response.next !== null, response.previous !== null);
  }

  private resetPaymentState(): void {
    this.totalPayments.set(0);
    this.paymentHistory.set([]);
    this.totalPages.set(null);
    this.pageSize.set(0);
  }

  private updatePaginationState(
    totalPayments: number,
    currentResultCount: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  ): void {
    if (currentResultCount > 0 && hasNextPage) {
      this.pageSize.set(currentResultCount);
    }

    if (totalPayments === 0) {
      this.totalPages.set(null);
      this.pageSize.set(0);
      return;
    }

    if (!hasNextPage && !hasPreviousPage) {
      this.totalPages.set(PAYMENT_PAGE_CONFIG.defaultPageNumber);
      this.pageSize.set(currentResultCount);
      return;
    }

    if (!hasNextPage && hasPreviousPage && currentResultCount > 0 && this.currentPage() > PAYMENT_PAGE_CONFIG.defaultPageNumber) {
      const inferredPageSize = (totalPayments - currentResultCount) / (this.currentPage() - 1);
      if (Number.isInteger(inferredPageSize) && inferredPageSize > 0) {
        this.pageSize.set(inferredPageSize);
      }
    }

    if (this.pageSize() > 0) {
      this.totalPages.set(Math.max(Math.ceil(totalPayments / this.pageSize()), PAYMENT_PAGE_CONFIG.defaultPageNumber));
      return;
    }

    this.pageSize.set(currentResultCount);
    const resolvedTotalPages = currentResultCount > 0
      ? Math.max(Math.ceil(totalPayments / currentResultCount), PAYMENT_PAGE_CONFIG.defaultPageNumber)
      : PAYMENT_PAGE_CONFIG.defaultPageNumber;
    this.totalPages.set(resolvedTotalPages);
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

  private navigateToPage(pageNumber: number): void {
    const resolvedPageNumber = Math.max(pageNumber, PAYMENT_PAGE_CONFIG.defaultPageNumber);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [PAYMENT_PAGE_CONFIG.pageQueryParam]: resolvedPageNumber,
        [PAYMENT_PAGE_CONFIG.orderingQueryParam]: this.currentOrdering(),
        [PAYMENT_PAGE_CONFIG.searchQueryParam]: this.currentSearch()
      },
      queryParamsHandling: 'merge'
    });
  }

  private resolveReceiptResponse(
    response: HttpResponse<Blob>,
    payment: PaymentHistoryItem
  ): Observable<boolean> {
    const receiptBody = response.body;
    if (!receiptBody || receiptBody.size === 0) {
      return of(false);
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (this.isTextLikeContent(contentType)) {
      return from(receiptBody.text()).pipe(
        map((payloadText) => {
          const normalizedPayloadText = payloadText.trim();
          const receiptUrl = this.extractReceiptUrl(this.parseJsonSafely(normalizedPayloadText))
            ?? this.extractReceiptUrl(normalizedPayloadText);

          if (receiptUrl === null) {
            return false;
          }

          this.openExternalUrl(receiptUrl);
          return true;
        })
      );
    }

    const fileName = this.extractReceiptFileName(response, payment.ref_id);
    this.downloadBlob(receiptBody, fileName);
    return of(true);
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
      return this.resolveUrl(value);
    }

    if (!this.isRecord(value)) {
      return null;
    }

    for (const receiptKey of PAYMENT_RECEIPT_KEYS) {
      const receiptValue = value[receiptKey];
      if (typeof receiptValue === 'string') {
        const resolvedReceiptUrl = this.resolveUrl(receiptValue);
        if (resolvedReceiptUrl !== null) {
          return resolvedReceiptUrl;
        }
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

  private resolveUrl(value: string): string | null {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return null;
    }

    try {
      const parsedUrl = new URL(trimmedValue, globalThis.location?.origin ?? 'http://localhost');
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:' ? parsedUrl.toString() : null;
    } catch {
      return null;
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

  private resolveTotalRecordsLabel(): string {
    const resolvedTotalPayments = this.totalPayments();
    return `${resolvedTotalPayments} record${resolvedTotalPayments === 1 ? '' : 's'}`;
  }

  private resolvePageLabel(): string {
    const resolvedTotalPages = this.totalPages();
    if (resolvedTotalPages === null) {
      return `Page ${this.currentPage()}`;
    }

    return `Page ${this.currentPage()} of ${resolvedTotalPages}`;
  }
}
