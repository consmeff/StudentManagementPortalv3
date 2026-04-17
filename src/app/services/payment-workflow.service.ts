import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApplicationService } from './application.service';
import { PaymentRefResponse } from '../data/dashboard/payment.data';

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

      this.makePayment(ref, hooks);
    } catch {
      hooks?.onProcessingChange?.(false);
      hooks?.onError?.('Payment Error', 'Unable to initialize payment. Please try again.');
    }
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
        sessionStorage.setItem('paymentref', reference);
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
