import { Routes } from '@angular/router';
import { featureAccessGuard } from '../../services/feature-access.guard';
import { PortalShellComponent } from '../shared/portal-shell.component';
import { ReturningCgpaTrackerComponent } from './pages/returning-cgpa-tracker/returning-cgpa-tracker.component';
import { ReturningCoursesComponent } from './pages/returning-courses/returning-courses.component';
import { ReturningDashboardComponent } from './pages/returning-dashboard/returning-dashboard.component';
import { ReturningHostelComponent } from './pages/returning-hostel/returning-hostel.component';
import { ReturningPaymentComponent } from './pages/returning-payment/returning-payment.component';
import { ReturningResultsComponent } from './pages/returning-results/returning-results.component';

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
    component: ReturningResultsComponent,
    canActivate: [featureAccessGuard],
    data: {
      feature: 'results'
    }
  },
  {
    path: 'cgpa-tracker',
    component: ReturningCgpaTrackerComponent,
    canActivate: [featureAccessGuard],
    data: {
      feature: 'cgpaTracker'
    }
  },
  {
    path: 'hostel',
    component: ReturningHostelComponent,
    canActivate: [featureAccessGuard],
    data: {
      feature: 'hostel'
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
