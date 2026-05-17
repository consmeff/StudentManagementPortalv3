export type DataTableColumnAlign = 'start' | 'center' | 'end';

export type DataTableColumn = {
  key: string;
  label: string;
  sortable?: boolean;
  align?: DataTableColumnAlign;
  className?: string;
};

export type DataTableRowContext<TRowData> = {
  $implicit: TRowData;
  index: number;
};
