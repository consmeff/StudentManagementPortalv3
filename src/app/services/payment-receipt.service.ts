import { HttpResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { EMPTY, Observable, from } from 'rxjs';
import { catchError, concatMap, finalize, map, tap } from 'rxjs/operators';

import { PAYMENT_PAGE_CONFIG } from '../constants/payment-page.constants';
import { PAYMENT_RECEIPT_DOWNLOAD } from '../constants/payment-receipt.constants';
import { PaymentHistoryItem } from '../data/application/payment.data';
import { downloadBlobResponse } from '../utility/file-download';
import { isSuccessfulPaymentStatus } from '../utility/payment-format';
import { ApplicationService } from './application.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentReceiptService {
  readonly activeDownloadKey = signal<string | null>(null);

  constructor(
    private readonly appService: ApplicationService,
    private readonly messageService: MessageService
  ) {
  }

  isDownloading(downloadKey: string): boolean {
    return this.activeDownloadKey() === downloadKey;
  }

  downloadReceipt(referenceId: string): void {
    const trimmedReferenceId = referenceId.trim();
    if (trimmedReferenceId.length === 0 || this.activeDownloadKey() !== null) {
      return;
    }

    this.runDownload(trimmedReferenceId, this.fetchAndSaveReceipt(trimmedReferenceId));
  }

  downloadReceiptsForPaymentType(paymentTypeKeyword: string, options: { latestOnly: boolean }): void {
    const normalizedKeyword = paymentTypeKeyword.trim().toLowerCase();
    if (normalizedKeyword.length === 0 || this.activeDownloadKey() !== null) {
      return;
    }

    const receiptDownloads = this.findCompletedReferenceIds(normalizedKeyword).pipe(
      map((referenceIds) => (options.latestOnly ? referenceIds.slice(0, 1) : referenceIds)),
      tap((referenceIds) => this.warnWhenNothingToDownload(referenceIds)),
      concatMap((referenceIds) => from(referenceIds)),
      concatMap((referenceId) => this.fetchAndSaveReceipt(referenceId))
    );

    this.runDownload(normalizedKeyword, receiptDownloads);
  }

  private runDownload(downloadKey: string, download$: Observable<unknown>): void {
    this.activeDownloadKey.set(downloadKey);
    download$.pipe(
      catchError(() => EMPTY),
      finalize(() => this.activeDownloadKey.set(null))
    ).subscribe();
  }

  private fetchAndSaveReceipt(referenceId: string): Observable<HttpResponse<Blob>> {
    return this.appService.getPaymentReceipt(referenceId).pipe(
      tap((response) => this.saveReceipt(response, referenceId))
    );
  }

  private saveReceipt(response: HttpResponse<Blob>, referenceId: string): void {
    const saved = downloadBlobResponse(
      response,
      `payment-receipt-${referenceId}.${PAYMENT_PAGE_CONFIG.defaultReceiptExtension}`
    );

    if (!saved) {
      this.messageService.add({
        severity: 'warn',
        summary: PAYMENT_RECEIPT_DOWNLOAD.toastSummary,
        detail: PAYMENT_RECEIPT_DOWNLOAD.emptyFileDetail
      });
    }
  }

  private findCompletedReferenceIds(normalizedKeyword: string): Observable<string[]> {
    return this.appService.getPayments({
      page: PAYMENT_PAGE_CONFIG.defaultPageNumber,
      pageSize: PAYMENT_RECEIPT_DOWNLOAD.lookupPageSize,
      ordering: PAYMENT_RECEIPT_DOWNLOAD.lookupOrdering,
      search: null
    }).pipe(
      map((response) => response.results
        .filter((payment) => this.isCompletedPaymentOfType(payment, normalizedKeyword))
        .map((payment) => payment.ref_id.trim()))
    );
  }

  private isCompletedPaymentOfType(payment: PaymentHistoryItem, normalizedKeyword: string): boolean {
    return payment.ref_id.trim().length > 0
      && isSuccessfulPaymentStatus(payment.status)
      && payment.payment_type.toLowerCase().includes(normalizedKeyword);
  }

  private warnWhenNothingToDownload(referenceIds: ReadonlyArray<string>): void {
    if (referenceIds.length > 0) {
      return;
    }

    this.messageService.add({
      severity: 'info',
      summary: PAYMENT_RECEIPT_DOWNLOAD.toastSummary,
      detail: PAYMENT_RECEIPT_DOWNLOAD.noCompletedPaymentsDetail
    });
  }
}
