import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PublicContentService } from '../../services/public-content.service';
import { DIRECTORS_SPEECH } from '../../data/public-content.data';
import { PublicImageComponent } from '../../components/public-image/public-image.component';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-directors-speech-section',
  standalone: true,
  imports: [RouterLink, PublicImageComponent, RevealOnScrollDirective],
  templateUrl: './directors-speech-section.component.html',
  styleUrl: './directors-speech-section.component.scss'
})
export class DirectorsSpeechSectionComponent {
  private readonly content = inject(PublicContentService);

  readonly speech = toSignal(this.content.getDirectorsSpeech(), { initialValue: DIRECTORS_SPEECH });
}
