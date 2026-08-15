import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PublicContentService } from '../../services/public-content.service';
import { HERO_CONTENT } from '../../data/public-content.data';
import { PublicImageComponent } from '../../components/public-image/public-image.component';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [RouterLink, PublicImageComponent, RevealOnScrollDirective],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss'
})
export class HeroSectionComponent {
  private readonly content = inject(PublicContentService);

  readonly hero = toSignal(this.content.getHero(), { initialValue: HERO_CONTENT });
}
