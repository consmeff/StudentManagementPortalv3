import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApplicationService } from './application.service';
import { PaymentRefResponse } from '../data/dashboard/payment.data';
import { AuthSessionStore } from '../store/auth-session.store';

type PaystackCallbackResponse = {
  reference: string;
};

type PaystackHandler = {
  openIframe: () => void;
};

type PaystackSetupConfig = {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  callback: (response: PaystackCallbackResponse) => Promise<void>;
  onClose: () => void;
};

type PaystackPopType = {
  setup: (config: PaystackSetupConfig) => PaystackHandler;
};

declare const PaystackPop: PaystackPopType;

export interface PaymentWorkflowHooks {
  onProcessingChange?: (processing: boolean) => void;
  onVerifyingChange?: (verifying: boolean) => void;
  onSuccess?: (title: string, message: string) => void;
  onError?: (title: string, message: string) => void;
  onWarning?: (title: string, message: string) => void;
  onVerified?: () => void;
  postVerifyNavigateTo?: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentWorkflowService {
  private readonly appService = inject(ApplicationService);

  private readonly router = inject(Router);

  private readonly authSessionStore = inject(AuthSessionStore);

  async startForApplication(applicationNo: string, hooks?: PaymentWorkflowHooks): Promise<void> {
    await this.startPayment(
      applicationNo,
      () => firstValueFrom(this.appService.getPaymentRef({ application_no: applicationNo })),
      hooks
    );
  }

  async startAcceptanceFeePayment(applicationNo: string, hooks?: PaymentWorkflowHooks): Promise<void> {
    await this.startPayment(
      applicationNo,
      () => firstValueFrom(this.appService.acceptanceFeePayment({ application_no: applicationNo })),
      hooks
    );
  }

  private async startPayment(
    applicationNo: string,
    paymentRequest: () => Promise<PaymentRefResponse>,
    hooks?: PaymentWorkflowHooks
  ): Promise<void> {
    if (!applicationNo) {
      hooks?.onError?.('Error', 'Application number not found');
      return;
    }

    hooks?.onProcessingChange?.(true);
    try {
      const ref = await paymentRequest();
      hooks?.onProcessingChange?.(false);

      if (!ref?.ref_id) {
        hooks?.onError?.('Payment Error', 'Unable to initialize payment. Please try again.');
        return;
      }

      const redirected = this.redirectToHostedPayment(ref, hooks);
      if (!redirected) {
        this.makePayment(applicationNo, ref, hooks);
      }
    } catch (error) {
      hooks?.onProcessingChange?.(false);
      throw error;
    }
  }

  private redirectToHostedPayment(ref: PaymentRefResponse, hooks?: PaymentWorkflowHooks): boolean {
    const rawUrl = ref?.payment_url ?? '';
    const sanitizedUrl = rawUrl.trim().replace(/^[`'"\s]+|[`'"\s]+$/g, '');

    if (!sanitizedUrl || !/^https?:\/\//i.test(sanitizedUrl)) {
      return false;
    }

    this.authSessionStore.setPaymentRef(ref.ref_id);
    hooks?.onSuccess?.('Redirecting to Payment', 'Taking you to the secure payment page...');
    globalThis.location.assign(sanitizedUrl);
    return true;
  }

  private makePayment(applicationNo: string, ref: PaymentRefResponse, hooks?: PaymentWorkflowHooks): void {
    const handler = PaystackPop.setup({
      key: 'pk_test_3303a8dc18ea2a4b2728543b34813870ba6f8bd6',
      email: ref.email || 'solixzdev@gmail.com',
      amount: +ref.amount * 100,
      currency: 'NGN',
      ref: ref.ref_id,
      callback: async (response) => {
        const {reference} = response;
        this.authSessionStore.setPaymentRef(reference);
        hooks?.onVerifyingChange?.(true);

        try {
          await firstValueFrom(this.appService.verifyPayment({ ref_id: reference }));
          await this.syncPaymentStatus(applicationNo);
          hooks?.onVerifyingChange?.(false);
          hooks?.onSuccess?.('Payment Successful', 'Your payment has been verified successfully.');
          hooks?.onVerified?.();

          const postVerifyNavigateTo = hooks?.postVerifyNavigateTo ?? '/auth/login';
          setTimeout(() => {
            this.router.navigateByUrl(postVerifyNavigateTo);
          }, 1500);
        } catch {
          hooks?.onVerifyingChange?.(false);
        }
      },
      onClose: () => {
        hooks?.onWarning?.('Payment Cancelled', 'Transaction was not completed');
      },
    });

    handler.openIframe();
  }

  private async syncPaymentStatus(applicationNo: string): Promise<void> {
    const applicantNo = (applicationNo || this.authSessionStore.applicationNo() || '').trim();
    if (!applicantNo) {
      return;
    }

    try {
      const snapshot = await firstValueFrom(this.appService.registrantData(applicantNo));
      this.authSessionStore.syncRegistrantSession(snapshot?.data ?? null);
    } catch {
      // Keep payment flow resilient even if status refresh fails.
    }
  }
}
