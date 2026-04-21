import { Routes } from '@angular/router';
import { PortalShellComponent } from '../shared/portal-shell.component';

export default [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: PortalShellComponent,
    data: {
      title: 'Returning Student Dashboard',
      description: 'This dashboard flow is reserved for returning students and will host registration and continuation actions.'
    }
  },
  {
    path: 'profile',
    component: PortalShellComponent,
    data: {
      title: 'Returning Student Profile',
      description: 'Returning-student profile and records will be managed in this area.'
    }
  },
  {
    path: 'payment',
    component: PortalShellComponent,
    data: {
      title: 'Returning Student Payments',
      description: 'Payment history and returning-student payment operations will be configured here.'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
] as Routes;
