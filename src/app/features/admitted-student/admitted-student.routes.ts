import { Routes } from '@angular/router';
import { featureAccessGuard } from '../../services/feature-access.guard';
import { AdmittedCoursesComponent } from './pages/admitted-courses/admitted-courses.component';
import { AdmittedDashboardComponent } from './pages/admitted-dashboard/admitted-dashboard.component';
import { AdmittedPaymentComponent } from './pages/admitted-payment/admitted-payment.component';
import { AdmittedProfileComponent } from './pages/admitted-profile/admitted-profile.component';

export default [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: AdmittedDashboardComponent,
    canActivate: [featureAccessGuard],
    data: { feature: 'dashboard' }
  },
  {
    path: 'profile',
    component: AdmittedProfileComponent,
    canActivate: [featureAccessGuard],
    data: { feature: 'profile' }
  },
  {
    path: 'payment',
    component: AdmittedPaymentComponent,
    canActivate: [featureAccessGuard],
    data: { feature: 'payment' }
  },
  {
    path: 'courses',
    component: AdmittedCoursesComponent,
    canActivate: [featureAccessGuard],
    data: { feature: 'profile' }
  },
  { path: '**', redirectTo: 'dashboard' }
] as Routes;
