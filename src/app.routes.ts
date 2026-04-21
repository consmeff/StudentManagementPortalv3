import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { authGuard } from './app/services/auth.guard.guard';
import { portalEntryGuard } from './app/services/portal-entry.guard';
import { PortalEntryStubComponent } from './app/features/shared/portal-entry-stub.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: '', pathMatch: 'full', canActivate: [portalEntryGuard], component: PortalEntryStubComponent },
            { path: 'new', loadChildren: () => import('./app/features/new-candidate/new-candidate.routes') },
            { path: 'admitted', loadChildren: () => import('./app/features/admitted-student/admitted-student.routes') },
            { path: 'returning', loadChildren: () => import('./app/features/returning-student/returning-student.routes') },
            { path: 'pages', loadChildren: () => import('./app/features/new-candidate/new-candidate.routes') },
        ]
    },

    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    
    { path: '**', redirectTo: '/auth/login' } // This will catch all unknown routes
];
