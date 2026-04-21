import { Routes } from '@angular/router';

import { Dashboard } from '../../pages/dashboard/dashboard.component';
import { PaymentComponent } from '../../pages/payment/payment.component';
import { AdmissionformComponent } from '../../pages/admissionform/admissionform.component';
import { ApplicationsummaryComponent } from '../../widgets/admission/forms/applicationsummary/applicationsummary.component';
import { featureAccessGuard } from '../../services/feature-access.guard';

export default [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard, canActivate: [featureAccessGuard], data: { feature: 'dashboard' } },
  { path: 'profile', redirectTo: 'admissionform', pathMatch: 'full' },
  { path: 'payment', component: PaymentComponent, canActivate: [featureAccessGuard], data: { feature: 'payment' } },
  { path: 'admissionform', component: AdmissionformComponent, canActivate: [featureAccessGuard], data: { feature: 'admissionform' } },
  { path: 'summarypage', component: ApplicationsummaryComponent, canActivate: [featureAccessGuard], data: { feature: 'summarypage' } },
  { path: '**', redirectTo: 'dashboard' }
] as Routes;
