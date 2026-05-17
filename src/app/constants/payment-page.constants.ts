import { DataTableColumn } from '../shared/components/data-table/data-table.types';

export const PAYMENT_PAGE_CONFIG = {
  currencyCode: 'NGN',
  currencyLocale: 'en-NG',
  dateLocale: 'en-GB',
  defaultReceiptExtension: 'pdf',
  defaultPageNumber: 1,
  pageQueryParam: 'page',
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
  { key: 'date', label: 'Date', sortable: true },
  { key: 'paymentType', label: 'Payment Type', sortable: true },
  { key: 'applicant', label: 'Applicant' },
  { key: 'referenceNumber', label: 'Reference Number', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'amountPaid', label: 'Amount Paid', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'summary', label: 'Summary' },
  { key: 'actions', label: 'Actions', align: 'end' }
] as const;

export const PAYMENT_TABLE_GRID_TEMPLATE = '1.05fr 1.4fr 1.4fr 1.3fr 1fr 1fr 0.9fr 1.8fr auto';
