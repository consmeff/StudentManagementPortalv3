import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PublicContentService } from '../../services/public-content.service';
import { PublicImageComponent } from '../../components/public-image/public-image.component';
import { formatLongDateWithOrdinal } from '../../utils/format-date';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

/**
 * "News & Announcements" block. Reused on the Media page with `limit` cleared
 * and the "View All" action hidden.
 */
@Component({
  selector: 'app-news-section',
  standalone: true,
  imports: [RouterLink, PublicImageComponent, RevealOnScrollDirective],
  templateUrl: './news-section.component.html',
  styleUrl: './news-section.component.scss'
})
export class NewsSectionComponent {
  private readonly content = inject(PublicContentService);

  readonly heading = input('News & Announcements');

  /** Omit (or pass 0) to render every article. */
  readonly limit = input(0);

  readonly showViewAll = input(true);

  private readonly allArticles = toSignal(this.content.getNews(), { initialValue: [] });

  readonly articles = computed(() => {
    const limit = this.limit();
    const articles = this.allArticles();
    return limit > 0 ? articles.slice(0, limit) : articles;
  });

  formatDate(isoDate: string): string {
    return formatLongDateWithOrdinal(isoDate);
  }
}
