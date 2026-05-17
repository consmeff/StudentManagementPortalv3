import { CommonModule } from '@angular/common';
import { Component, computed, input, TemplateRef, TrackByFunction } from '@angular/core';

import { DATA_TABLE_CONFIG } from '../../../constants/data-table.constants';

import { DataTableColumn, DataTableRowContext } from './data-table.types';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent<TRowData> {
  readonly columns = input.required<ReadonlyArray<DataTableColumn>>();
  readonly rows = input.required<ReadonlyArray<TRowData>>();
  readonly rowTemplate = input.required<TemplateRef<DataTableRowContext<TRowData>>>();
  readonly gridTemplateColumns = input<string>(DATA_TABLE_CONFIG.defaultGridTemplateColumns);
  readonly loading = input<boolean>(false);
  readonly loadingMessage = input<string>(DATA_TABLE_CONFIG.defaultLoadingMessage);
  readonly emptyMessage = input<string>(DATA_TABLE_CONFIG.defaultEmptyMessage);
  readonly trackBy = input<TrackByFunction<TRowData>>((index) => index);
  readonly hasRows = computed(() => this.rows().length > 0);
  readonly trackByRow: TrackByFunction<TRowData> = (index, row) => this.trackBy()(index, row);

  resolveHeaderClass(column: DataTableColumn): string {
    if (column.align === 'center') {
      return 'align-center';
    }
    if (column.align === 'end') {
      return 'align-end';
    }
    return 'align-start';
  }

}
