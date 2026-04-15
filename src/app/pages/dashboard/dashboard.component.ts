import { Component } from '@angular/core';
import { PendingPaymentFlowComponent } from '../../widgets/dashboard/pending-payment-flow/pending-payment-flow.component';

@Component({
    selector: 'app-dashboard',
    imports: [PendingPaymentFlowComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class Dashboard {
}
