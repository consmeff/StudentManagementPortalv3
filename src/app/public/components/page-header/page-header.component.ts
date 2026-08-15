import { Component, input } from '@angular/core';

/**
 * Title band for public sub-pages, standing in for the landing page's hero.
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="pub-shell page-header__inner">
      <h1 class="page-header__title">{{ title() }}</h1>
      @if (subtitle()) {
        <p class="page-header__subtitle">{{ subtitle() }}</p>
      }
    </div>
  `,
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  readonly title = input.required<string>();

  readonly subtitle = input('');
}
