import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ObjectivesSectionComponent } from '../../sections/objectives/objectives-section.component';
import { DirectorsSpeechSectionComponent } from '../../sections/directors-speech/directors-speech-section.component';
import { ManagementTeamSectionComponent } from '../../sections/management-team/management-team-section.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ObjectivesSectionComponent,
    DirectorsSpeechSectionComponent,
    ManagementTeamSectionComponent
  ],
  template: `
    <app-page-header
      title="About Us"
      subtitle="To produce trained Midwives who are competent, skilled and always available to provide maternal and infant services at all tiers of health care delivery."
    />
    <app-objectives-section heading="Our Objectives" />
    <app-directors-speech-section />
    <app-management-team-section heading="Our Management Team" />
  `
})
export class AboutComponent {}
