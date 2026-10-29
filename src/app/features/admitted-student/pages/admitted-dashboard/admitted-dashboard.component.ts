import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdmittedFlowService } from '../../admitted-flow.service';
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { PaymentReceiptService } from '../../../../services/payment-receipt.service';
import { PAYMENT_TYPE_KEYWORDS } from '../../../../constants/payment-receipt.constants';

@Component({
  selector: 'app-admitted-dashboard',
  standalone: true,
  imports: [CommonModule, TraceabilityModule],
  templateUrl: './admitted-dashboard.component.html',
  styleUrl: './admitted-dashboard.component.scss'
})
export class AdmittedDashboardComponent implements OnInit {
  private readonly router = inject(Router);

  readonly flow = inject(AdmittedFlowService);

  readonly receiptDownloads = inject(PaymentReceiptService);

  ngOnInit(): void {
    void this.flow.loadSnapshot();
  }

  goToAcceptancePayment(): void {
    void this.router.navigateByUrl('/admitted/acceptance-payment');
  }

  goToSchoolFeesPayment(): void {
    void this.router.navigateByUrl('/admitted/payment');
  }

  downloadReceipt(): void {
    this.receiptDownloads.downloadReceiptsForPaymentType(PAYMENT_TYPE_KEYWORDS.acceptanceFee, { latestOnly: true });
  }
}
