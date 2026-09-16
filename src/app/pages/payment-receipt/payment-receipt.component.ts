import { Component, DestroyRef, Inject, OnInit, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

import { AUTH_RETURN_URL_QUERY_PARAM } from '../../constants/auth.constants';
import {
  PAYMENT_RECEIPT_CONFIG,
  PAYMENT_RECEIPT_FIELD_LABELS,
  PAYMENT_RECEIPT_MESSAGES,
  PAYMENT_RECEIPT_NOTICES,
  PAYMENT_RECEIPT_RESULT
} from '../../constants/payment-receipt.constants';
import {
  PAYMENT_RECEIPT_STATE,
  PaymentReceiptField,
  PaymentReceiptNotice,
  PaymentReceiptResult,
  PaymentReceiptState
} from '../../constants/payment-receipt.types';
import { PaymentReceiptVerification } from '../../data/application/payment.data';
import { ApplicationService } from '../../services/application.service';
import { PaymentReceiptService } from '../../services/payment-receipt.service';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { QrCodeComponent } from '../../shared/components/qr-code/qr-code.component';
import { TraceabilityModule } from '../../shared/traceability.module';
import { AuthSessionStore } from '../../store/auth-session.store';
import { buildPaymentReceiptVerificationPath } from '../../utility/payment-receipt-url';
import {
  displayPaymentValue,
  formatPaymentCurrency,
  formatPaymentDateTime,
  resolvePaymentStatusClass
} from '../../utility/payment-format';

@Component({
  selector: 'app-payment-receipt',
  standalone: true,
  imports: [TraceabilityModule, ButtonComponent, QrCodeComponent],
  templateUrl: './payment-receipt.component.html',
  styleUrl: './payment-receipt.component.scss'
})
export class PaymentReceiptComponent implements OnInit {
  readonly receiptConfig = PAYMENT_RECEIPT_CONFIG;

  readonly receiptMessages = PAYMENT_RECEIPT_MESSAGES;

  readonly receiptState = signal<PaymentReceiptState>(PAYMENT_RECEIPT_STATE.loading);

  readonly referenceId = signal<string>('');

  readonly verification = signal<PaymentReceiptVerification | null>(null);

  readonly isDownloading = computed(() => this.receiptDownloads.isDownloading(this.referenceId()));

  readonly isLoading = computed(() => this.receiptState() === PAYMENT_RECEIPT_STATE.loading);

  readonly isValidReceipt = computed(() => this.verification()?.is_valid === true);

  readonly isSignedIn = computed(() => this.authSessionStore.jwtToken().length > 0);

  readonly result = computed<PaymentReceiptResult | null>(() => this.resolveResult());

  readonly notice = computed<PaymentReceiptNotice | null>(() => this.resolveNotice());

  readonly statusClass = computed(() => resolvePaymentStatusClass(this.verification()?.status ?? ''));

  readonly detailFields = computed<ReadonlyArray<PaymentReceiptField>>(() => this.resolveDetailFields());

  readonly verificationUrl = computed<string>(() => this.buildVerificationUrl());

  readonly qrDescription = computed<string>(
    () => `${PAYMENT_RECEIPT_CONFIG.qrDescriptionPrefix} ${this.referenceId()}`
  );

  readonly signInQueryParams = computed<Record<string, string>>(() => ({
    [AUTH_RETURN_URL_QUERY_PARAM]: this.buildVerificationPath()
  }));

  constructor(
    private readonly route: ActivatedRoute,
    private readonly appService: ApplicationService,
    private readonly receiptDownloads: PaymentReceiptService,
    @Inject(AuthSessionStore) private readonly authSessionStore: InstanceType<typeof AuthSessionStore>,
    private readonly destroyRef: DestroyRef
  ) {
  }

  ngOnInit(): void {
    this.observeReferenceId();
  }

  retry(): void {
    this.verifyReceipt(this.referenceId()).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  printVerification(): void {
    globalThis.print();
  }

  downloadReceipt(): void {
    this.receiptDownloads.downloadReceipt(this.referenceId());
  }

  private observeReferenceId(): void {
    this.route.queryParamMap.pipe(
      map((params) => params.get(PAYMENT_RECEIPT_CONFIG.referenceQueryParam)?.trim() ?? ''),
      distinctUntilChanged(),
      switchMap((referenceId) => this.verifyReceipt(referenceId)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private verifyReceipt(referenceId: string): Observable<PaymentReceiptVerification> {
    this.referenceId.set(referenceId);
    this.verification.set(null);

    if (referenceId.length === 0) {
      this.receiptState.set(PAYMENT_RECEIPT_STATE.missingReference);
      return EMPTY;
    }

    this.receiptState.set(PAYMENT_RECEIPT_STATE.loading);
    return this.appService.verifyPaymentReceipt(referenceId).pipe(
      tap((verification) => {
        this.verification.set(verification);
        this.receiptState.set(PAYMENT_RECEIPT_STATE.loaded);
      }),
      catchError(() => {
        this.receiptState.set(PAYMENT_RECEIPT_STATE.error);
        return EMPTY;
      })
    );
  }

  private resolveResult(): PaymentReceiptResult | null {
    const verification = this.verification();
    if (verification === null) {
      return null;
    }

    const outcome = verification.is_valid ? PAYMENT_RECEIPT_RESULT.valid : PAYMENT_RECEIPT_RESULT.invalid;
    const apiMessage = verification.message.trim();

    return {
      title: outcome.title,
      detail: apiMessage.length > 0 ? apiMessage : outcome.fallbackDetail,
      toneClass: outcome.toneClass,
      iconClass: outcome.iconClass
    };
  }

  private resolveNotice(): PaymentReceiptNotice | null {
    const state = this.receiptState();

    if (state === PAYMENT_RECEIPT_STATE.missingReference) {
      return PAYMENT_RECEIPT_NOTICES.missingReference;
    }

    return state === PAYMENT_RECEIPT_STATE.error ? PAYMENT_RECEIPT_NOTICES.error : null;
  }

  private resolveDetailFields(): ReadonlyArray<PaymentReceiptField> {
    const verification = this.verification();
    if (verification === null || !verification.is_valid) {
      return [];
    }

    return [
      { label: PAYMENT_RECEIPT_FIELD_LABELS.receiptNumber, value: displayPaymentValue(verification.receipt_no) },
      { label: PAYMENT_RECEIPT_FIELD_LABELS.referenceNumber, value: displayPaymentValue(verification.reference_no) },
      { label: PAYMENT_RECEIPT_FIELD_LABELS.paymentType, value: displayPaymentValue(verification.payment_type) },
      { label: PAYMENT_RECEIPT_FIELD_LABELS.paidBy, value: displayPaymentValue(verification.paid_by) },
      {
        label: PAYMENT_RECEIPT_FIELD_LABELS.applicationNumber,
        value: displayPaymentValue(verification.application_no)
      },
      { label: PAYMENT_RECEIPT_FIELD_LABELS.session, value: displayPaymentValue(verification.session) },
      { label: PAYMENT_RECEIPT_FIELD_LABELS.amount, value: formatPaymentCurrency(verification.amount) },
      { label: PAYMENT_RECEIPT_FIELD_LABELS.amountPaid, value: formatPaymentCurrency(verification.amount_paid) },
      { label: PAYMENT_RECEIPT_FIELD_LABELS.issuedAt, value: formatPaymentDateTime(verification.issued_at) },
      { label: PAYMENT_RECEIPT_FIELD_LABELS.verifiedAt, value: formatPaymentDateTime(verification.verified_at) }
    ];
  }

  private buildVerificationPath(): string {
    return buildPaymentReceiptVerificationPath(this.referenceId());
  }

  private buildVerificationUrl(): string {
    if (this.referenceId().length === 0) {
      return '';
    }

    return new URL(this.buildVerificationPath(), globalThis.location.origin).toString();
  }
}
