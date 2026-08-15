import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { NewsSectionComponent } from '../../sections/news/news-section.component';

@Component({
  selector: 'app-media-page',
  standalone: true,
  imports: [PageHeaderComponent, NewsSectionComponent],
  template: `
    <app-page-header
      title="Media"
      subtitle="News, announcements and updates from the College of Nursing Sciences, Muslim Medical Foundation."
    />
    <app-news-section heading="News &amp; Announcements" [showViewAll]="false" />
  `
})
export class MediaComponent {}
