import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { PublicContentService } from '../../services/public-content.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [PageHeaderComponent, RouterLink],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private readonly content = inject(PublicContentService);

  readonly contact = toSignal(this.content.getContactDetails(), { initialValue: null });

  readonly socialLinks = toSignal(this.content.getSocialLinks(), { initialValue: [] });

  telHref(phoneNumber: string): string {
    return `tel:${phoneNumber.replace(/[^\d+]/g, '')}`;
  }
}
