import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PublicContentService } from '../../services/public-content.service';
import { PublicImageComponent } from '../../components/public-image/public-image.component';

@Component({
  selector: 'app-facilities-section',
  standalone: true,
  imports: [PublicImageComponent],
  templateUrl: './facilities-section.component.html',
  styleUrl: './facilities-section.component.scss'
})
export class FacilitiesSectionComponent {
  private readonly content = inject(PublicContentService);

  readonly heading = input('Unique Facilities we have');

  readonly facilities = toSignal(this.content.getFacilities(), { initialValue: [] });
}
