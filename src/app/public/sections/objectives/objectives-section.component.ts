import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PublicContentService } from '../../services/public-content.service';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-objectives-section',
  standalone: true,
  imports: [RevealOnScrollDirective],
  templateUrl: './objectives-section.component.html',
  styleUrl: './objectives-section.component.scss'
})
export class ObjectivesSectionComponent {
  private readonly content = inject(PublicContentService);

  readonly heading = input('Objectives of the School');

  readonly objectives = toSignal(this.content.getObjectives(), { initialValue: [] });
}
