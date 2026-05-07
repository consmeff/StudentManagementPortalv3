import { Routes } from '@angular/router';
import { featureAccessGuard } from '../../services/feature-access.guard';
import { PortalShellComponent } from '../shared/portal-shell.component';
import { ReturningCoursesComponent } from './pages/returning-courses/returning-courses.component';
import { ReturningDashboardComponent } from './pages/returning-dashboard/returning-dashboard.component';
import { ReturningPaymentComponent } from './pages/returning-payment/returning-payment.component';

export default [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: ReturningDashboardComponent,
    canActivate: [featureAccessGuard],
    data: { feature: 'dashboard' }
  },
  {
    path: 'courses',
    component: ReturningCoursesComponent,
    canActivate: [featureAccessGuard],
    data: { feature: 'courses' }
  },
  {
    path: 'results',
    component: PortalShellComponent,
    canActivate: [featureAccessGuard],
    data: {
      feature: 'results',
      title: 'My Results',
      description: 'Semester and session result breakdown for returning students will display here.'
    }
  },
  {
    path: 'cgpa-tracker',
    component: PortalShellComponent,
    canActivate: [featureAccessGuard],
    data: {
      feature: 'cgpaTracker',
      title: 'CGPA Tracker',
      description: 'Cumulative GPA history, trend analysis, and grade projections will be shown here.'
    }
  },
  {
    path: 'hostel',
    component: PortalShellComponent,
    canActivate: [featureAccessGuard],
    data: {
      feature: 'hostel',
      title: 'Hostel',
      description: 'Hostel allocation, room details, and accommodation requests will be managed here.'
    }
  },
  {
    path: 'profile',
    component: PortalShellComponent,
    canActivate: [featureAccessGuard],
    data: {
      feature: 'profile',
      title: 'Returning Student Profile',
      description: 'Returning-student profile and records will be managed in this area.'
    }
  },
  {
    path: 'payment',
    component: ReturningPaymentComponent,
    canActivate: [featureAccessGuard],
    data: {
      feature: 'payment'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
] as Routes;
