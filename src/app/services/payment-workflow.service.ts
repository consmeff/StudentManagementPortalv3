import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApplicationService } from './application.service';
import { StudentFeePaymentPayload } from '../data/application/student-fees.dto';
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
  onVerified?: (reference?: string) => void;
  postVerifyNavigateTo?: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentWorkflowService {
  private readonly appService = inject(ApplicationService);

  private readonly router = inject(Router);

  private readonly authSessionStore = inject(AuthSessionStore);

  async startForApplication(applicationNo: string, hooks?: PaymentWorkflowHooks): Promise<void> {
    await this.startPayment(
      () => firstValueFrom(this.appService.getPaymentRef({ application_no: applicationNo })),
      hooks,
      applicationNo
    );
  }

  async startAcceptanceFeePayment(applicationNo: string, hooks?: PaymentWorkflowHooks): Promise<void> {
    await this.startPayment(
      () => firstValueFrom(this.appService.acceptanceFeePayment({ application_no: applicationNo })),
      hooks,
      applicationNo
    );
  }

  async startStudentFeesPayment(
    payload: StudentFeePaymentPayload,
    hooks?: PaymentWorkflowHooks,
    applicantNo?: string
  ): Promise<void> {
    await this.startPayment(
      () => firstValueFrom(this.appService.initiateStudentFeePayment(payload)),
      hooks,
      applicantNo
    );
  }

  private async startPayment(
    paymentRequest: () => Promise<PaymentRefResponse>,
    hooks?: PaymentWorkflowHooks,
    applicantNo?: string
  ): Promise<void> {
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
        this.makePayment(applicantNo, ref, hooks);
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

  private makePayment(applicantNo: string | undefined, ref: PaymentRefResponse, hooks?: PaymentWorkflowHooks): void {
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
          await this.syncPaymentStatus(applicantNo ?? '');
          hooks?.onVerifyingChange?.(false);
          hooks?.onSuccess?.('Payment Successful', 'Your payment has been verified successfully.');
          hooks?.onVerified?.(reference);

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
