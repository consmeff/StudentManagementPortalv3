import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { LoadingService } from '../services/loading.service';


@Component({
  selector: 'app-global-loading',
  imports: [CommonModule],
  template: `
    <div class="loading-overlay" *ngIf="isLoading()">
      <div class="loading-container">
        <div class="spinner"></div>
        <p class="loading-text">Loading...</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      backdrop-filter: blur(2px);
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--app-surface);
      border: 1px solid var(--app-border);
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007ad9;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      margin-top: 1rem;
      color: var(--app-text-primary);
      font-size: 16px;
      font-weight: 500;
    }

    ::ng-deep .custom-spinner .p-progress-spinner-circle {
      stroke: #007ad9 !important;
      stroke-width: 3 !important;
    }

    ::ng-deep .custom-spinner svg {
      width: 50px !important;
      height: 50px !important;
    }

    /* Alternative: Force visibility with multiple color fallbacks */
    ::ng-deep .loading-overlay .p-progress-spinner circle {
      stroke: #007ad9 !important;
      stroke-width: 3 !important;
      fill: none !important;
    }

    /* Ensure the SVG itself is visible */
    ::ng-deep .loading-overlay .p-progress-spinner svg {
      display: block !important;
      width: 50px !important;
      height: 50px !important;
    }
  `]
})
export class GlobalLoadingComponent {
  readonly isLoading;

  constructor(private readonly loadingService: LoadingService) {
    this.isLoading = this.loadingService.loading;
  }
}
