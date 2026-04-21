import { Component, OnInit, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { MessageService } from 'primeng/api';

// Services & DTOs
import { WidgetsService } from '../../widgets/services/widgets.service';
import { ApplicationService } from '../../services/application.service';
import { TraceabilityModule } from '../../shared/traceability.module';
import { RegistrantData } from '../../data/application/registrantdatadto';
import { sidebarStateDTO } from '../../data/dashboard/dash.dto';
import { AuthSessionStore } from '../../store/auth-session.store';

type PaymentHistoryRow = {
  date: string;
  paymentType: string;
  referenceNumber: string;
  amount: string;
  receiptUrl: string;
};

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    TraceabilityModule
  ],
  providers: [MessageService],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  sidebarVisible = false;
  _widgetService = inject(WidgetsService);
  authSessionStore = inject(AuthSessionStore);
  isLoading = false;
  paymentHistory: PaymentHistoryRow[] = [];
  regData: RegistrantData | null = null;

  constructor(
    private appService: ApplicationService,
    private messageService: MessageService
  ) {
    this._widgetService.sidebarState$.subscribe((state: sidebarStateDTO) => {
      this.sidebarVisible = state.isvisible;
    });
  }

  ngOnInit(): void {
    void this.loadPaymentHistory();
  }

  async loadPaymentHistory(): Promise<void> {
    const appNo = this.authSessionStore.applicationNo() || '';
    if (!appNo) return;

    this.isLoading = true;
    try {
      const snapshot = await firstValueFrom(this.appService.registratantData(appNo));
      this.regData = snapshot?.data ?? null;
      this.paymentHistory = this.buildPaymentHistory(this.regData);
    } catch {
      this.showError('Payment History', 'Unable to load payment history');
    } finally {
      this.isLoading = false;
    }
  }

  private buildPaymentHistory(data: RegistrantData | null): PaymentHistoryRow[] {
    if (!data) {
      return [];
    }
    const hasPaid = this.isPaidStatus(data.payment_status || this.authSessionStore.paymentStatus() || '');
    if (!hasPaid) {
      return [];
    }

    return [{
      date: this.formatDate(data.updated_at || data.created_at),
      paymentType: 'Admission Application Fee',
      referenceNumber: this.authSessionStore.paymentRef() || data.application_no || '—',
      amount: '₦20,000',
      receiptUrl: data.payment_slip?.file_url || ''
    }];
  }

  private isPaidStatus(status: string): boolean {
    const normalized = (status || '').toLowerCase().trim();
    return !!normalized && (
      normalized.includes('paid')
      || normalized.includes('complete')
      || normalized.includes('success')
    );
  }

  private formatDate(value: string | Date | undefined): string {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  downloadReceipt(item: PaymentHistoryRow): void {
    if (item.receiptUrl) {
      window.open(item.receiptUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const receiptText = [
      'Payment Receipt',
      `Date: ${item.date}`,
      `Payment Type: ${item.paymentType}`,
      `Reference Number: ${item.referenceNumber}`,
      `Amount: ${item.amount}`,
    ].join('\n');
    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `payment-receipt-${item.referenceNumber}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  // Notification helpers
  private showError(title: string, message: string) {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: 5000
    });
  }
}
