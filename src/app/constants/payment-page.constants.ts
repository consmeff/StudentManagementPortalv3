import { DataTableColumn } from '../shared/components/data-table/data-table.types';

export const PAYMENT_PAGE_CONFIG = {
  currencyCode: 'NGN',
  currencyLocale: 'en-NG',
  dateLocale: 'en-GB',
  defaultReceiptExtension: 'pdf',
  defaultPageNumber: 1,
  defaultPageSize: 10,
  searchDebounceMs: 300,
  pageQueryParam: 'page',
  pageSizeQueryParam: 'page_size',
  orderingQueryParam: 'ordering',
  searchQueryParam: 'search'
} as const;

export const PAYMENT_STATUS_CLASS = {
  completed: 'status-pill--completed',
  failed: 'status-pill--failed',
  pending: 'status-pill--pending',
  default: 'status-pill--default'
} as const;

export const PAYMENT_RECEIPT_KEYS = [
  'receipt_url',
  'file_url',
  'url',
  'download_url',
  'receipt'
] as const;

export const PAYMENT_TABLE_COLUMNS: ReadonlyArray<DataTableColumn> = [
  { key: 'date', label: 'Date', sortable: true, sortKey: 'created_at' },
  { key: 'paymentType', label: 'Payment Type', sortable: true, sortKey: 'payment_type' },
  { key: 'applicant', label: 'Applicant' },
  { key: 'referenceNumber', label: 'Reference Number', sortable: true, sortKey: 'ref_id' },
  { key: 'amount', label: 'Amount', sortable: true, sortKey: 'amount' },
  { key: 'amountPaid', label: 'Amount Paid', sortable: true, sortKey: 'amount_paid' },
  { key: 'status', label: 'Status' },
  { key: 'summary', label: 'Summary' },
  { key: 'actions', label: 'Actions', align: 'end' }
] as const;

export const PAYMENT_TABLE_GRID_TEMPLATE = '1.05fr 1.4fr 1.4fr 1.3fr 1fr 1fr 0.9fr 1.8fr auto';
