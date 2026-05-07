import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReturningFlowService } from '../../returning-flow.service';

@Component({
  selector: 'app-returning-cgpa-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './returning-cgpa-tracker.component.html',
  styleUrl: './returning-cgpa-tracker.component.scss'
})
export class ReturningCgpaTrackerComponent {
  readonly flow = inject(ReturningFlowService);
}

