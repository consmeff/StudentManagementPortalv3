import { CommonModule } from '@angular/common';
import { Component, computed, input, output, TemplateRef, TrackByFunction } from '@angular/core';
import { TableModule } from 'primeng/table';

import { DATA_TABLE_CONFIG } from '../../../constants/data-table.constants';

import { DataTableColumn, DataTableRowContext } from './data-table.types';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent<TRowData> {
  readonly columns = input.required<ReadonlyArray<DataTableColumn>>();

  readonly rows = input.required<ReadonlyArray<TRowData>>();

  readonly rowTemplate = input.required<TemplateRef<DataTableRowContext<TRowData>>>();

  readonly gridTemplateColumns = input<string>(DATA_TABLE_CONFIG.defaultGridTemplateColumns);

  readonly scrollable = input<boolean>(false);

  readonly scrollHeight = input<string>('flex');

  readonly loading = input<boolean>(false);

  readonly loadingMessage = input<string>(DATA_TABLE_CONFIG.defaultLoadingMessage);

  readonly emptyMessage = input<string>(DATA_TABLE_CONFIG.defaultEmptyMessage);

  readonly trackBy = input<TrackByFunction<TRowData>>((index) => index);

  readonly activeSortKey = input<string | null>(null);

  readonly activeSortDirection = input<'asc' | 'desc' | null>(null);

  readonly hasRows = computed(() => this.rows().length > 0);

  readonly tableRows = computed<TRowData[]>(() => [...this.rows()]);

  readonly columnCount = computed(() => this.columns().length);

  readonly columnWidths = computed(() => this.resolveColumnWidths());

  readonly trackByRow: TrackByFunction<TRowData> = (index, row) => this.trackBy()(index, row);

  readonly sortChange = output<string>();

  resolveHeaderClass(column: DataTableColumn): string {
    if (column.align === 'center') {
      return 'align-center';
    }
    if (column.align === 'end') {
      return 'align-end';
    }
    return 'align-start';
  }

  isSortable(column: DataTableColumn): boolean {
    return column.sortable === true;
  }

  isActiveSort(column: DataTableColumn): boolean {
    return this.resolveSortKey(column) === this.activeSortKey();
  }

  resolveSortIconClass(column: DataTableColumn): string {
    if (!this.isSortable(column)) {
      return 'pi pi-sort-alt sort-indicator';
    }

    if (!this.isActiveSort(column) || this.activeSortDirection() === null) {
      return 'pi pi-sort-alt sort-indicator';
    }

    return this.activeSortDirection() === 'asc'
      ? 'pi pi-sort-amount-up-alt sort-indicator sort-indicator-active'
      : 'pi pi-sort-amount-down sort-indicator sort-indicator-active';
  }

  emitSortChange(column: DataTableColumn): void {
    if (!this.isSortable(column)) {
      return;
    }

    this.sortChange.emit(this.resolveSortKey(column));
  }

  private resolveSortKey(column: DataTableColumn): string {
    return column.sortKey ?? column.key;
  }

  private resolveColumnWidths(): string[] {
    const matchedWidths = this.gridTemplateColumns().match(/minmax\([^)]+\)|[^\s]+/g) ?? [];
    const normalizedWidths = matchedWidths.length > 0
      ? matchedWidths
      : Array.from({ length: this.columnCount() }, () => 'auto');

    if (normalizedWidths.length >= this.columnCount()) {
      return normalizedWidths;
    }

    return [
      ...normalizedWidths,
      ...Array.from({ length: this.columnCount() - normalizedWidths.length }, () => 'auto')
    ];
  }
}
