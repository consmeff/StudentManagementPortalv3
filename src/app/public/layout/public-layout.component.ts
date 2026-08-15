import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PublicHeaderComponent } from '../components/public-header/public-header.component';
import { PublicFooterComponent } from '../components/public-footer/public-footer.component';

/**
 * Chrome for every public (unauthenticated) page.
 *
 * The `public-site` class on the host is what scopes the marketing design tokens
 * in `public-theme.scss`; without it the whole subtree falls back to portal
 * styling, so keep it on the host binding.
 */
@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, PublicHeaderComponent, PublicFooterComponent],
  template: `
    <app-public-header />
    <main id="main-content" tabindex="-1">
      <router-outlet />
    </main>
    <app-public-footer />
  `,
  host: { class: 'public-site' },
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      main {
        flex: 1 1 auto;
        outline: none;
      }
    `
  ]
})
export class PublicLayoutComponent {}
