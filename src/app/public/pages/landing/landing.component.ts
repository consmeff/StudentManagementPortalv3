import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../sections/hero/hero-section.component';
import { ObjectivesSectionComponent } from '../../sections/objectives/objectives-section.component';
import { DirectorsSpeechSectionComponent } from '../../sections/directors-speech/directors-speech-section.component';
import { ManagementTeamSectionComponent } from '../../sections/management-team/management-team-section.component';
import { ProgrammesSectionComponent } from '../../sections/programmes/programmes-section.component';
import { FacilitiesSectionComponent } from '../../sections/facilities/facilities-section.component';
import { NewsSectionComponent } from '../../sections/news/news-section.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    HeroSectionComponent,
    ObjectivesSectionComponent,
    DirectorsSpeechSectionComponent,
    ManagementTeamSectionComponent,
    ProgrammesSectionComponent,
    FacilitiesSectionComponent,
    NewsSectionComponent
  ],
  template: `
    <app-hero-section />
    <app-objectives-section />
    <app-directors-speech-section />
    <app-management-team-section />
    <app-programmes-section />
    <app-facilities-section />
    <app-news-section [limit]="3" />
  `
})
export class LandingComponent {}
