import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, map, switchMap, tap } from 'rxjs/operators';

import {
  PAYMENT_PAGE_CONFIG,
  PAYMENT_TABLE_COLUMNS,
  PAYMENT_TABLE_GRID_TEMPLATE
} from '../../constants/payment-page.constants';
import {
  formatPaymentCurrency,
  formatPaymentDate,
  resolvePaymentStatusClass
} from '../../utility/payment-format';
import { buildPaymentReceiptVerificationPath } from '../../utility/payment-receipt-url';
import { PaginatedPaymentsResponse, PaymentHistoryItem } from '../../data/application/payment.data';
import { WidgetsService } from '../../widgets/services/widgets.service';
import { ApplicationService } from '../../services/application.service';
import { PaymentReceiptService } from '../../services/payment-receipt.service';
import { TraceabilityModule } from '../../shared/traceability.module';
import { sidebarStateDTO } from '../../data/dashboard/dash.dto';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';

type TPaymentQueryState = {
  pageNumber: number;
  pageSize: number;
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
    PaginationComponent,
    SearchInputComponent
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  readonly sidebarVisible = signal<boolean>(false);

  readonly isLoading = signal<boolean>(false);

  readonly paymentHistory = signal<PaymentHistoryItem[]>([]);

  readonly totalPayments = signal<number>(0);

  readonly currentPage = signal<number>(PAYMENT_PAGE_CONFIG.defaultPageNumber);

  readonly totalPages = signal<number | null>(null);

  readonly currentPageSize = signal<number>(PAYMENT_PAGE_CONFIG.defaultPageSize);

  readonly currentOrdering = signal<string | null>(null);

  readonly currentSearch = signal<string | null>(null);

  readonly searchValue = signal<string>('');

  readonly totalRecordsLabel = computed(() => this.resolveTotalRecordsLabel());

  readonly pageLabel = computed(() => this.resolvePageLabel());

  readonly showPageSummary = computed(() => !this.isLoading() && this.paymentHistory().length > 0);

  readonly showPagination = computed(() => !this.isLoading() && this.paymentHistory().length > 0 && this.totalPages() !== null);

  readonly activeSortKey = computed(() => this.resolveActiveSortKey());

  readonly activeSortDirection = computed(() => this.resolveActiveSortDirection());

  readonly paymentTableColumns = PAYMENT_TABLE_COLUMNS;

  readonly paymentTableGridTemplate = PAYMENT_TABLE_GRID_TEMPLATE;

  private readonly searchValueChange$ = new Subject<string>();

  constructor(
    private readonly widgetService: WidgetsService,
    private readonly appService: ApplicationService,
    private readonly receiptDownloads: PaymentReceiptService,
    private readonly destroyRef: DestroyRef,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
  }

  ngOnInit(): void {
    this.observeSidebarState();
    this.observeSearchValueChanges();
    this.observePaymentQueryState();
  }

  openReceiptPage(item: PaymentHistoryItem): void {
    const referenceId = item.ref_id.trim();
    if (!referenceId) {
      return;
    }

    globalThis.open(buildPaymentReceiptVerificationPath(referenceId), '_blank', 'noopener');
  }

  downloadReceipt(item: PaymentHistoryItem): void {
    this.receiptDownloads.downloadReceipt(item.ref_id);
  }

  formatDate(value: string): string {
    return formatPaymentDate(value);
  }

  formatCurrency(amount: number | null): string {
    return formatPaymentCurrency(amount);
  }

  paymentStatusClass(status: string): string {
    return resolvePaymentStatusClass(status);
  }

  isReceiptLoading(refId: string): boolean {
    return this.receiptDownloads.isDownloading(refId);
  }

  trackPaymentRow(index: number, item: PaymentHistoryItem): string {
    return item.ref_id || `${index}`;
  }

  goToPage(pageNumber: number): void {
    this.navigateToPage(pageNumber);
  }

  updatePageSize(pageSize: number): void {
    this.navigateToPage(PAYMENT_PAGE_CONFIG.defaultPageNumber, pageSize);
  }

  updateSearchValue(searchValue: string): void {
    this.searchValue.set(searchValue);
    this.searchValueChange$.next(searchValue);
  }

  clearSearch(): void {
    this.searchValue.set('');
    this.navigateWithQueryState(PAYMENT_PAGE_CONFIG.defaultPageNumber, this.currentPageSize(), this.currentOrdering(), null);
  }

  updateOrdering(sortKey: string): void {
    const nextOrdering = this.resolveNextOrdering(sortKey);
    this.navigateWithQueryState(PAYMENT_PAGE_CONFIG.defaultPageNumber, this.currentPageSize(), nextOrdering, this.currentSearch());
  }

  private observeSidebarState(): void {
    this.widgetService.sidebarState$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((state: sidebarStateDTO) => {
      this.sidebarVisible.set(state.isvisible);
    });
  }

  private observeSearchValueChanges(): void {
    this.searchValueChange$.pipe(
      debounceTime(PAYMENT_PAGE_CONFIG.searchDebounceMs),
      map((searchValue) => this.normalizeQueryValue(searchValue)),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((normalizedSearch) => {
      if (normalizedSearch === this.currentSearch()) {
        return;
      }

      this.navigateWithQueryState(
        PAYMENT_PAGE_CONFIG.defaultPageNumber,
        this.currentPageSize(),
        this.currentOrdering(),
        normalizedSearch
      );
    });
  }

  private observePaymentQueryState(): void {
    this.route.queryParamMap.pipe(
      map((queryParams) => this.mapQueryState(queryParams)),
      distinctUntilChanged((previousState, currentState) =>
        previousState.pageNumber === currentState.pageNumber
        && previousState.pageSize === currentState.pageSize
        && previousState.ordering === currentState.ordering
        && previousState.search === currentState.search
      ),
      tap((queryState) => {
        this.currentPage.set(queryState.pageNumber);
        this.currentPageSize.set(queryState.pageSize);
        this.currentOrdering.set(queryState.ordering);
        this.currentSearch.set(queryState.search);
        this.searchValue.set(queryState.search ?? '');
        this.isLoading.set(true);
      }),
      switchMap((queryState) =>
        this.appService.getPayments({
          page: queryState.pageNumber,
          pageSize: queryState.pageSize,
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
      pageSize: this.parsePageSize(queryParams.get(PAYMENT_PAGE_CONFIG.pageSizeQueryParam)),
      ordering: this.normalizeQueryValue(queryParams.get(PAYMENT_PAGE_CONFIG.orderingQueryParam)),
      search: this.normalizeQueryValue(queryParams.get(PAYMENT_PAGE_CONFIG.searchQueryParam))
    };
  }

  private applyPaymentResponse(response: PaginatedPaymentsResponse): void {
    this.paymentHistory.set(response.results);
    this.totalPayments.set(response.count);
    this.updatePaginationState(response.count);
  }

  private resetPaymentState(): void {
    this.totalPayments.set(0);
    this.paymentHistory.set([]);
    this.totalPages.set(null);
  }

  private updatePaginationState(totalPayments: number): void {
    if (totalPayments === 0) {
      this.totalPages.set(null);
      return;
    }

    const resolvedTotalPages = Math.max(
      Math.ceil(totalPayments / this.currentPageSize()),
      PAYMENT_PAGE_CONFIG.defaultPageNumber
    );
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

  private parsePageSize(pageSizeValue: string | null): number {
    if (!pageSizeValue) {
      return PAYMENT_PAGE_CONFIG.defaultPageSize;
    }

    const pageSize = Number(pageSizeValue);
    return Number.isFinite(pageSize) && pageSize > 0
      ? Math.trunc(pageSize)
      : PAYMENT_PAGE_CONFIG.defaultPageSize;
  }

  private normalizeQueryValue(value: string | null): string | null {
    return value && value.trim().length > 0 ? value.trim() : null;
  }

  private navigateToPage(pageNumber: number, pageSize: number = this.currentPageSize()): void {
    this.navigateWithQueryState(pageNumber, pageSize, this.currentOrdering(), this.currentSearch());
  }

  private navigateWithQueryState(
    pageNumber: number,
    pageSize: number,
    ordering: string | null,
    search: string | null
  ): void {
    const resolvedPageNumber = Math.max(pageNumber, PAYMENT_PAGE_CONFIG.defaultPageNumber);
    const resolvedPageSize = Math.max(pageSize, PAYMENT_PAGE_CONFIG.defaultPageSize);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        [PAYMENT_PAGE_CONFIG.pageQueryParam]: resolvedPageNumber,
        [PAYMENT_PAGE_CONFIG.pageSizeQueryParam]: resolvedPageSize,
        [PAYMENT_PAGE_CONFIG.orderingQueryParam]: ordering,
        [PAYMENT_PAGE_CONFIG.searchQueryParam]: search
      },
      queryParamsHandling: 'merge'
    });
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

  private resolveActiveSortKey(): string | null {
    const currentOrdering = this.currentOrdering();
    if (currentOrdering === null || currentOrdering.trim().length === 0) {
      return null;
    }

    return currentOrdering.startsWith('-') ? currentOrdering.slice(1) : currentOrdering;
  }

  private resolveActiveSortDirection(): 'asc' | 'desc' | null {
    const currentOrdering = this.currentOrdering();
    if (currentOrdering === null || currentOrdering.trim().length === 0) {
      return null;
    }

    return currentOrdering.startsWith('-') ? 'desc' : 'asc';
  }

  private resolveNextOrdering(sortKey: string): string | null {
    const activeSortKey = this.activeSortKey();
    const activeSortDirection = this.activeSortDirection();

    if (activeSortKey !== sortKey) {
      return sortKey;
    }

    if (activeSortDirection === 'asc') {
      return `-${sortKey}`;
    }

    if (activeSortDirection === 'desc') {
      return null;
    }

    return sortKey;
  }
}
