import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PublicContentService } from '../../services/public-content.service';
import { SITE_IDENTITY } from '../../data/public-content.data';
import { PublicBrandComponent } from '../public-brand/public-brand.component';

@Component({
  selector: 'app-public-footer',
  standalone: true,
  imports: [RouterLink, PublicBrandComponent],
  templateUrl: './public-footer.component.html',
  styleUrl: './public-footer.component.scss'
})
export class PublicFooterComponent {
  private readonly content = inject(PublicContentService);

  readonly identity = toSignal(this.content.getSiteIdentity(), { initialValue: SITE_IDENTITY });

  readonly quickLinks = toSignal(this.content.getQuickLinks(), { initialValue: [] });

  readonly programmeLinks = toSignal(this.content.getFooterProgrammeLinks(), { initialValue: [] });

  readonly contact = toSignal(this.content.getContactDetails(), { initialValue: null });

  readonly socialLinks = toSignal(this.content.getSocialLinks(), { initialValue: [] });

  readonly currentYear = new Date().getFullYear();

  /** `tel:` targets must be digits only, with the leading `+` preserved. */
  telHref(phoneNumber: string): string {
    return `tel:${phoneNumber.replace(/[^\d+]/g, '')}`;
  }
}
