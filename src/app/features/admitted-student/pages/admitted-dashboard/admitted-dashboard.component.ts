import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdmittedFlowService } from '../../admitted-flow.service';
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { PaymentReceiptService } from '../../../../services/payment-receipt.service';
import { PAYMENT_TYPE_KEYWORDS } from '../../../../constants/payment-receipt.constants';
import { readPaymentReferenceFromQuery } from '../../../../utility/payment-reference';

@Component({
  selector: 'app-admitted-dashboard',
  standalone: true,
  imports: [CommonModule, TraceabilityModule],
  templateUrl: './admitted-dashboard.component.html',
  styleUrl: './admitted-dashboard.component.scss'
})
export class AdmittedDashboardComponent implements OnInit {
  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  readonly flow = inject(AdmittedFlowService);

  readonly receiptDownloads = inject(PaymentReceiptService);

  ngOnInit(): void {
    void this.loadDashboard();
  }

  private async loadDashboard(): Promise<void> {
    const returnedReference = readPaymentReferenceFromQuery(this.route.snapshot.queryParamMap);
    try {
      await this.flow.loadSnapshot();
    } finally {
      await this.flow.syncAcceptancePayment(returnedReference);
      this.clearPaymentReferenceFromUrl(returnedReference);
    }
  }

  private clearPaymentReferenceFromUrl(returnedReference: string | null): void {
    if (returnedReference) {
      void this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
    }
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
