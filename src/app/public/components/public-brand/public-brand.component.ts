import { Component, input } from '@angular/core';
import { SITE_IDENTITY } from '../../data/public-content.data';

/**
 * Institution wordmark for the public site.
 *
 * Rendered as text rather than an image because the repo's only logo asset
 * (`assets/images/logo.svg`) is an unrelated "afrihealth" mark. When the real
 * crest is supplied, drop it at `assets/images/public/crest.svg` and render it
 * alongside `.brand__text` — the two-line lockup below already matches the
 * design's colour split.
 */
@Component({
  selector: 'app-public-brand',
  standalone: true,
  template: `
    <span class="brand__text" [class.brand__text--compact]="compact()">
      <span class="brand__line brand__line--primary">{{ institutionName }}</span>
      <span class="brand__line brand__line--secondary">{{ foundationName }}</span>
    </span>
  `,
  styleUrl: './public-brand.component.scss'
})
export class PublicBrandComponent {
  /** Smaller variant used in the header. */
  readonly compact = input(false);

  readonly institutionName = SITE_IDENTITY.institutionName;

  readonly foundationName = SITE_IDENTITY.foundationName;
}
