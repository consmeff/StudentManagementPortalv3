import { Routes } from '@angular/router';
import { PortalShellComponent } from '../shared/portal-shell.component';

export default [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: PortalShellComponent,
    data: {
      title: 'Admitted Student Dashboard',
      description: 'This dashboard flow is reserved for admitted students and will host admission decision, acceptance, and onboarding steps.'
    }
  },
  {
    path: 'profile',
    component: PortalShellComponent,
    data: {
      title: 'Admitted Student Profile',
      description: 'Profile and student record management for admitted students will live here.'
    }
  },
  {
    path: 'payment',
    component: PortalShellComponent,
    data: {
      title: 'Admitted Student Payments',
      description: 'Payment history and admitted-student payment actions will be configured in this section.'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
] as Routes;
