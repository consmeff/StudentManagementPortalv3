import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TraceabilityModule } from '../../../../shared/traceability.module';
import { ReturningFlowService } from '../../returning-flow.service';

@Component({
  selector: 'app-returning-payment',
  standalone: true,
  imports: [CommonModule, TraceabilityModule],
  providers: [MessageService],
  templateUrl: './returning-payment.component.html',
  styleUrl: './returning-payment.component.scss'
})
export class ReturningPaymentComponent {
  readonly flow = inject(ReturningFlowService);
  private readonly messageService = inject(MessageService);

  readonly isSubmitting = signal(false);
  readonly amount = signal(`${this.flow.suggestedAmount()}`);
  readonly history = computed(() => this.flow.paymentHistory());

  async recordPayment(): Promise<void> {
    const amount = this.parseAmount(this.amount());
    const fallback = this.flow.suggestedAmount();
    const finalAmount = amount > 0 ? amount : fallback;

    this.isSubmitting.set(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const result = this.flow.addDummyPayment(finalAmount);
    this.isSubmitting.set(false);

    if (!result.ok) {
      this.messageService.add({ severity: 'warn', summary: 'Payment', detail: result.message });
      return;
    }

    this.amount.set(`${this.flow.suggestedAmount()}`);
    this.messageService.add({ severity: 'success', summary: 'Payment', detail: result.message });
  }

  private parseAmount(value: string): number {
    const cleaned = (value || '').replace(/[^\d]/g, '');
    return cleaned ? Number(cleaned) : 0;
  }
}

