import { Component, input } from '@angular/core';
import { SITE_IDENTITY } from '../../data/public-content.data';

/**
 * Institution lockup for the public site: crest followed by the two-line
 * wordmark, matching the design's horizontal arrangement.
 *
 * The crest comes from `assets/consmmefs-logo.png`. The wordmark is text rather
 * than an image so it stays crisp at any size — `assets/logo.png` holds the same
 * lockup stacked vertically, which does not fit the header bar.
 * Note `assets/images/logo.svg` is an unrelated "afrihealth" mark; do not use it.
 */
@Component({
  selector: 'app-public-brand',
  standalone: true,
  template: `
    <!-- Decorative: the adjacent wordmark carries the accessible name. -->
    <img class="brand__crest" src="assets/consmmefs-logo.png" alt="" width="48" height="72" />
    <span class="brand__text" [class.brand__text--compact]="compact()">
      <span class="brand__line brand__line--primary">{{ institutionName }}</span>
      <span class="brand__line brand__line--secondary">{{ foundationName }}</span>
    </span>
  `,
  styleUrl: './public-brand.component.scss',
  host: { '[class.brand--compact]': 'compact()' }
})
export class PublicBrandComponent {
  /** Smaller variant used in the header. */
  readonly compact = input(false);

  readonly institutionName = SITE_IDENTITY.institutionName;

  readonly foundationName = SITE_IDENTITY.foundationName;
}
