import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ContentPendingComponent } from '../../components/content-pending/content-pending.component';
import { ProgrammesSectionComponent } from '../../sections/programmes/programmes-section.component';

@Component({
  selector: 'app-admissions-page',
  standalone: true,
  imports: [PageHeaderComponent, ContentPendingComponent, ProgrammesSectionComponent],
  template: `
    <app-page-header
      title="Admissions"
      subtitle="Application requirements, entry criteria and admission timelines for prospective students."
    />
    <app-content-pending
      message="Full admission requirements and entry criteria are being prepared and will be published shortly. Applications for the current session can be started now through the student portal."
    />
    <app-programmes-section heading="Programmes You Can Apply For" [showImage]="false" />
  `
})
export class AdmissionsComponent {}
