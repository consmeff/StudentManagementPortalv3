import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ReturningFlowService } from '../../returning-flow.service';

@Component({
  selector: 'app-returning-hostel',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  providers: [MessageService],
  templateUrl: './returning-hostel.component.html',
  styleUrl: './returning-hostel.component.scss'
})
export class ReturningHostelComponent {
  readonly flow = inject(ReturningFlowService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  readonly isSubmitting = signal(false);
  readonly draft = computed(() => this.flow.hostelApplicationDraft());
  readonly state = computed(() => this.flow.effectiveHostelStatus());
  readonly canSubmit = computed(() => {
    const d = this.draft();
    return !!d.academicSession && !!d.preferredHostel && !!d.preferredBlock && d.acknowledged;
  });

  goToPayment(): void {
    void this.router.navigateByUrl('/returning/payment');
  }

  updateField<K extends keyof ReturnType<ReturningFlowService['hostelApplicationDraft']>>(key: K, value: ReturnType<ReturningFlowService['hostelApplicationDraft']>[K]): void {
    this.flow.updateHostelDraft({ [key]: value } as any);
  }

  async submit(): Promise<void> {
    if (!this.canSubmit()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Hostel',
        detail: 'Please complete all required fields and acknowledge hostel rules.'
      });
      return;
    }
    this.isSubmitting.set(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const result = this.flow.submitHostelApplication(this.draft());
    this.isSubmitting.set(false);
    this.messageService.add({
      severity: result.ok ? 'success' : 'warn',
      summary: 'Hostel',
      detail: result.message
    });
  }

  // demo helper to match final screenshot state quickly without backend review process
  markAllocated(): void {
    this.flow.setHostelApplicationStatus('allocated');
  }

  printHostelSlip(): void {
    const room = this.flow.hostelAllocation();
    const lines = [
      'Hostel Slip',
      `Student: ${this.flow.studentName()}`,
      `Matric: ${this.flow.matricNo()}`,
      `Session: ${this.flow.session()}`,
      `Hostel: ${room.hostelName}`,
      `Block: ${room.block}`,
      `Room: ${room.roomNumber}`,
      `Bed: ${room.bed}`
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hostel-slip-${this.flow.matricNo().replace(/[^\w-]/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

