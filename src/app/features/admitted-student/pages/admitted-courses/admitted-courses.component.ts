import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admitted-courses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="courses-page">
      <h1>Courses</h1>
      <p>Registered courses for admitted students will appear here after onboarding is completed.</p>
    </div>
  `,
  styles: [`
    .courses-page {
      padding: 1.5rem;
    }
    h1 {
      margin: 0 0 0.5rem;
      color: #101f44;
    }
    p {
      margin: 0;
      color: #7486a8;
    }
  `]
})
export class AdmittedCoursesComponent {}
