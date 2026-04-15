import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApplicationGuidelineContent } from '../../../data/dashboard/application-guideline.data';
import { TraceabilityModule } from '../../../shared/traceability.module';

@Component({
  selector: 'app-application-guideline-modal',
  standalone: true,
  imports: [CommonModule, TraceabilityModule],
  templateUrl: './application-guideline-modal.component.html',
  styleUrl: './application-guideline-modal.component.scss',
})
export class ApplicationGuidelineModalComponent {
  @Input({ required: true }) content!: ApplicationGuidelineContent;
  @Input() visible = false;
  @Input() accepted = false;
  @Input() loading = false;
  @Input() continueLabel = 'Continue to Payment';

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() acceptedChange = new EventEmitter<boolean>();
  @Output() continueClicked = new EventEmitter<void>();

  onVisibleChange(next: boolean): void {
    this.visible = next;
    this.visibleChange.emit(next);
  }

  onAcceptedToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.accepted = checked;
    this.acceptedChange.emit(checked);
  }

  onContinue(): void {
    if (this.accepted && !this.loading) {
      this.continueClicked.emit();
    }
  }
}
