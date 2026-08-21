import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { authGuard } from './app/services/auth.guard.guard';
import { portalEntryGuard } from './app/services/portal-entry.guard';
import { portalSegmentGuard } from './app/services/portal-segment.guard';
import { PortalEntryStubComponent } from './app/features/shared/portal-entry-stub.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            // Portal entry points. Both resolve the signed-in user's segment and
            // redirect to their dashboard; `portal` is kept alongside `''` because
            // the auth error and access-denied pages link to it by name.
            { path: '', pathMatch: 'full', canActivate: [portalEntryGuard], component: PortalEntryStubComponent },
            { path: 'portal', pathMatch: 'full', canActivate: [portalEntryGuard], component: PortalEntryStubComponent },
            {
                path: 'new',
                canMatch: [portalSegmentGuard],
                data: { portalSegment: 'new' },
                loadChildren: () => import('./app/features/new-candidate/new-candidate.routes')
            },
            {
                path: 'admitted',
                canMatch: [portalSegmentGuard],
                data: { portalSegment: 'admitted' },
                loadChildren: () => import('./app/features/admitted-student/admitted-student.routes')
            },
            {
                path: 'returning',
                canMatch: [portalSegmentGuard],
                data: { portalSegment: 'returning' },
                loadChildren: () => import('./app/features/returning-student/returning-student.routes')
            },
            {
                path: 'pages',
                canMatch: [portalSegmentGuard],
                data: { portalSegment: 'new' },
                loadChildren: () => import('./app/features/new-candidate/new-candidate.routes')
            },
        ]
    },

    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },

    // Unknown routes fall through to the portal entry, which sends signed-out
    // visitors to the login page via `authGuard`. The public marketing site now
    // lives in its own deployment (../consmmefs-home) and is no longer routed here.
    { path: '**', redirectTo: '' }
];
