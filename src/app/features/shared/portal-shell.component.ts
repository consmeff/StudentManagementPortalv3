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
      background: #ffffff;
      border: 1px solid #dbe7f9;
      border-radius: 1rem;
    }
    h1 {
      margin: 0 0 0.5rem;
      color: #0f172a;
      font-size: 1.7rem;
    }
    p {
      margin: 0;
      color: #667085;
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
