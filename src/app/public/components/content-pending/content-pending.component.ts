import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Honest placeholder for public pages whose copy has not been supplied yet.
 *
 * Deliberately explicit rather than filled with invented institutional text —
 * a visitor is told the page is being prepared and is given a real next step.
 */
@Component({
  selector: 'app-content-pending',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="pub-shell content-pending__inner">
      <p class="content-pending__message">{{ message() }}</p>

      <div class="content-pending__actions">
        <a class="pub-btn pub-btn--primary" routerLink="/auth/signup">Apply Now</a>
        <a class="pub-btn pub-btn--outline" routerLink="/contact">Contact Us</a>
      </div>
    </div>
  `,
  styleUrl: './content-pending.component.scss'
})
export class ContentPendingComponent {
  readonly message = input(
    'Detailed information for this page is being prepared and will be published shortly.'
  );
}
