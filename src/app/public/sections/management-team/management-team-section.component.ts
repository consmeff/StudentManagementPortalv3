import { Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PublicContentService } from '../../services/public-content.service';
import { PublicImageComponent } from '../../components/public-image/public-image.component';

@Component({
  selector: 'app-management-team-section',
  standalone: true,
  imports: [PublicImageComponent],
  templateUrl: './management-team-section.component.html',
  styleUrl: './management-team-section.component.scss'
})
export class ManagementTeamSectionComponent {
  private readonly content = inject(PublicContentService);

  readonly heading = input('Management Team');

  readonly team = toSignal(this.content.getManagementTeam(), { initialValue: [] });
}
