import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ProgrammesSectionComponent } from '../../sections/programmes/programmes-section.component';
import { FacilitiesSectionComponent } from '../../sections/facilities/facilities-section.component';

@Component({
  selector: 'app-programmes-page',
  standalone: true,
  imports: [PageHeaderComponent, ProgrammesSectionComponent, FacilitiesSectionComponent],
  template: `
    <app-page-header
      title="Programmes"
      subtitle="Nursing and midwifery programmes offered at the College of Nursing Sciences, Muslim Medical Foundation."
    />
    <app-programmes-section heading="Academics Programs" [showImage]="false" />
    <app-facilities-section />
  `
})
export class ProgrammesPageComponent {}
