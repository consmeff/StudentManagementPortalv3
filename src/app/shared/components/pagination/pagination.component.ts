import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

import { PAGINATION_CONFIG } from '../../../constants/pagination.constants';

import { PaginationItem } from './pagination.types';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  readonly currentPage = input<number>(PAGINATION_CONFIG.defaultPageNumber);

  readonly totalPages = input<number>(PAGINATION_CONFIG.defaultPageNumber);

  readonly totalItems = input<number>(0);

  readonly pageSize = input<number>(PAGINATION_CONFIG.defaultPageSize);

  readonly pageSizeOptions = input<ReadonlyArray<number>>(PAGINATION_CONFIG.pageSizeOptions);

  readonly disabled = input<boolean>(false);

  readonly pageChange = output<number>();

  readonly pageSizeChange = output<number>();

  readonly showPagination = computed(() => this.totalItems() > 0 && this.totalPages() > 0);

  readonly startItem = computed(() => this.resolveStartItem());

  readonly endItem = computed(() => this.resolveEndItem());

  readonly pageItems = computed(() => this.resolvePageItems());

  canGoToPreviousPage(): boolean {
    return !this.disabled() && this.currentPage() > PAGINATION_CONFIG.defaultPageNumber;
  }

  canGoToNextPage(): boolean {
    return !this.disabled() && this.currentPage() < this.totalPages();
  }

  selectPreviousPage(): void {
    if (!this.canGoToPreviousPage()) {
      return;
    }
    this.pageChange.emit(this.currentPage() - 1);
  }

  selectNextPage(): void {
    if (!this.canGoToNextPage()) {
      return;
    }
    this.pageChange.emit(this.currentPage() + 1);
  }

  selectPage(pageItem: PaginationItem): void {
    if (pageItem === 'ellipsis' || pageItem === this.currentPage() || this.disabled()) {
      return;
    }
    this.pageChange.emit(pageItem);
  }

  selectPageSize(pageSizeValue: string): void {
    if (this.disabled()) {
      return;
    }

    const resolvedPageSize = Number(pageSizeValue);
    if (!Number.isFinite(resolvedPageSize) || resolvedPageSize <= 0 || resolvedPageSize === this.pageSize()) {
      return;
    }

    this.pageSizeChange.emit(Math.trunc(resolvedPageSize));
  }

  isCurrentPage(pageItem: PaginationItem): boolean {
    return typeof pageItem === 'number' && pageItem === this.currentPage();
  }

  private resolveStartItem(): number {
    if (this.totalItems() === 0 || this.pageSize() === 0) {
      return 0;
    }

    return ((this.currentPage() - 1) * this.pageSize()) + 1;
  }

  private resolveEndItem(): number {
    if (this.totalItems() === 0 || this.pageSize() === 0) {
      return 0;
    }

    return Math.min(this.totalItems(), this.currentPage() * this.pageSize());
  }

  private resolvePageItems(): PaginationItem[] {
    const resolvedTotalPages = this.totalPages();
    const resolvedCurrentPage = this.currentPage();

    if (resolvedTotalPages <= PAGINATION_CONFIG.maxVisibleItems) {
      return Array.from({ length: resolvedTotalPages }, (_, index) => index + 1);
    }

    if (resolvedCurrentPage <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis', resolvedTotalPages];
    }

    if (resolvedCurrentPage >= resolvedTotalPages - 3) {
      return [
        1,
        'ellipsis',
        resolvedTotalPages - 4,
        resolvedTotalPages - 3,
        resolvedTotalPages - 2,
        resolvedTotalPages - 1,
        resolvedTotalPages
      ];
    }

    return [
      1,
      'ellipsis',
      resolvedCurrentPage - 1,
      resolvedCurrentPage,
      resolvedCurrentPage + 1,
      'ellipsis',
      resolvedTotalPages
    ];
  }
}
