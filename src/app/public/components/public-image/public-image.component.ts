import { Component, computed, input, signal } from '@angular/core';

/**
 * Image slot that degrades to a neutral placeholder.
 *
 * Sections of the marketing site are content-ready ahead of their photography,
 * so a missing `src` — or one that 404s at runtime — must render as a calm grey
 * block rather than a broken-image icon. Decorative placeholders are hidden from
 * assistive tech; the real image keeps its alt text.
 */
@Component({
  selector: 'app-public-image',
  standalone: true,
  template: `
    @if (showImage()) {
      <img
        [src]="src()"
        [alt]="alt()"
        [attr.loading]="eager() ? null : 'lazy'"
        [attr.fetchpriority]="eager() ? 'high' : null"
        decoding="async"
        class="pub-image__img"
        (error)="onError()"
      />
    } @else {
      <div class="pub-image__placeholder" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="M21 16l-5-5-4.5 4.5L9 13l-6 6" />
        </svg>
      </div>
    }
  `,
  styleUrl: './public-image.component.scss'
})
export class PublicImageComponent {
  readonly src = input<string | null>(null);

  readonly alt = input('');

  /** Set for above-the-fold images so they are not lazy-loaded. */
  readonly eager = input(false);

  private readonly failed = signal(false);

  readonly showImage = computed(() => !!this.src() && !this.failed());

  onError(): void {
    this.failed.set(true);
  }
}
