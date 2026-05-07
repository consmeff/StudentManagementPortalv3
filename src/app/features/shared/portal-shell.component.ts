import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-portal-shell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="portal-shell">
      <h1>{{ title() }}</h1>
      <p>{{ description() }}</p>
    </div>
  `,
  styles: [`
    .portal-shell {
      padding: 1.5rem;
      background: var(--app-surface);
      border: 1px solid var(--app-border);
      border-radius: 1rem;
    }
    h1 {
      margin: 0 0 0.5rem;
      color: var(--app-text-primary);
      font-size: 1.7rem;
    }
    p {
      margin: 0;
      color: var(--app-text-secondary);
      max-width: 680px;
    }
  `]
})
export class PortalShellComponent {
  private readonly route = inject(ActivatedRoute);

  readonly title = computed(() => this.route.snapshot.data['title'] || 'Portal');
  readonly description = computed(
    () => this.route.snapshot.data['description'] || 'This section will be customized for this student category.'
  );
}
