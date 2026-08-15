import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { authGuard } from './app/services/auth.guard.guard';
import { portalEntryGuard } from './app/services/portal-entry.guard';
import { portalSegmentGuard } from './app/services/portal-segment.guard';
import { PortalEntryStubComponent } from './app/features/shared/portal-entry-stub.component';
import { publicRoutes } from './app/public/public.routes';

export const appRoutes: Routes = [
    // Public marketing site. Declared first so `/` resolves to the landing page
    // without the authenticated shell's guards ever being consulted. Its child
    // paths (about, programmes, admissions, media, contact) must stay distinct
    // from the portal paths below — see the note in public.routes.ts.
    ...publicRoutes,

    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            // Portal entry point. Was `''` before the public site took that path;
            // resolves the signed-in user's segment and redirects to their dashboard.
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

    { path: '**', redirectTo: '' } // Unknown routes land on the public landing page
];
