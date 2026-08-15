import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PublicContentService } from '../../services/public-content.service';
import { PublicImageComponent } from '../../components/public-image/public-image.component';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

/**
 * "Academics Programs" block. Reused on the Programmes page, where the
 * accompanying photograph is suppressed via `showImage`.
 */
@Component({
  selector: 'app-programmes-section',
  standalone: true,
  imports: [RouterLink, PublicImageComponent, RevealOnScrollDirective],
  templateUrl: './programmes-section.component.html',
  styleUrl: './programmes-section.component.scss'
})
export class ProgrammesSectionComponent {
  private readonly content = inject(PublicContentService);

  readonly heading = input('Academics Programs');

  readonly showImage = input(true);

  readonly programmes = toSignal(this.content.getProgrammes(), { initialValue: [] });

  readonly image = toSignal(this.content.getProgrammesImage(), { initialValue: null });
}
