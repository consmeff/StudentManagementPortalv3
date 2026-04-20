import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApplicationService } from './application.service';
import { PaymentRefResponse } from '../data/dashboard/payment.data';
import { AuthSessionStore } from '../store/auth-session.store';

declare let PaystackPop: any;

export interface PaymentWorkflowHooks {
  onProcessingChange?: (processing: boolean) => void;
  onVerifyingChange?: (verifying: boolean) => void;
  onSuccess?: (title: string, message: string) => void;
  onError?: (title: string, message: string) => void;
  onWarning?: (title: string, message: string) => void;
  onVerified?: () => void;
}

@Injectable({ providedIn: 'root' })
export class PaymentWorkflowService {
  private readonly appService = inject(ApplicationService);
  private readonly router = inject(Router);
  private readonly authSessionStore = inject(AuthSessionStore);

  async startForApplication(applicationNo: string, hooks?: PaymentWorkflowHooks): Promise<void> {
    if (!applicationNo) {
      hooks?.onError?.('Error', 'Application number not found');
      return;
    }

    hooks?.onProcessingChange?.(true);
    try {
      const ref = await firstValueFrom(this.appService.getPaymentRef({ application_no: applicationNo }));
      hooks?.onProcessingChange?.(false);

      if (!ref?.ref_id) {
        hooks?.onError?.('Payment Error', 'Unable to initialize payment. Please try again.');
        return;
      }

      const redirected = this.redirectToHostedPayment(ref, hooks);
      if (!redirected) {
        this.makePayment(ref, hooks);
      }
    } catch {
      hooks?.onProcessingChange?.(false);
      hooks?.onError?.('Payment Error', 'Unable to initialize payment. Please try again.');
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
    window.location.assign(sanitizedUrl);
    return true;
  }

  private makePayment(ref: PaymentRefResponse, hooks?: PaymentWorkflowHooks): void {
    const handler = PaystackPop.setup({
      key: 'pk_test_3303a8dc18ea2a4b2728543b34813870ba6f8bd6',
      email: ref.email || 'solixzdev@gmail.com',
      amount: +ref.amount * 100,
      currency: 'NGN',
      ref: ref.ref_id,
      callback: async (response: any) => {
        const reference = response.reference;
        this.authSessionStore.setPaymentRef(reference);
        hooks?.onVerifyingChange?.(true);

        try {
          await firstValueFrom(this.appService.verifyPayment({ ref_id: reference }));
          hooks?.onVerifyingChange?.(false);
          hooks?.onSuccess?.('Payment Successful', 'Your payment has been verified successfully, login to continue.');
          hooks?.onVerified?.();

          setTimeout(() => {
            this.router.navigateByUrl('/auth/login');
          }, 1500);
        } catch {
          hooks?.onVerifyingChange?.(false);
          hooks?.onError?.('Verification Failed', 'Payment verification failed. Please contact support.');
        }
      },
      onClose: () => {
        hooks?.onWarning?.('Payment Cancelled', 'Transaction was not completed');
      },
    });

    handler.openIframe();
  }
}
