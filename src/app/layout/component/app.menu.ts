import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { ALL_ROLES, PermissionService } from '../../services/permission.service';
import { RegStoreService } from '../../services/regstore.service';
import { RegistrantDataDTO } from '../../data/application/registrantdatadto';
import { Router } from '@angular/router';
import { NavigationAccessService, ProtectedPageFeature } from '../../services/navigation-access.service';
import { AuthSessionStore } from '../../store/auth-session.store';
import { UserPortalService } from '../../services/user-portal.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    private authSessionStore = inject(AuthSessionStore);
    private readonly userPortalService = inject(UserPortalService);

    constructor(
        private permission: PermissionService,
        private regstore: RegStoreService,
        private router: Router,
        private navigationAccess: NavigationAccessService
    ) {
        effect(() => {
            this.authSessionStore.paymentStatus();
            this.authSessionStore.userType();
            this.authSessionStore.matriculationNo();
            this.buildMenu();
        });
    }

    ngOnInit() {
        this.buildMenu();
        this.regstore.regData$.subscribe((data) => {
            this.setRegistrationStage(data);
            this.buildMenu();
        });

    }

    setRegistrationStage(data: RegistrantDataDTO|null) {
        const _data = data?.data;
        if (!_data) {
            return;
        }

        const registrationComplete = !!(
            _data.residential_address &&
            _data.primary_parent_or_guardian &&
            _data.academic_history &&
            _data.o_level_result &&
            _data.utme_result &&
            _data.certificate_of_birth &&
            _data.passport_photo
        );

        this.authSessionStore.setRegistrationComplete(registrationComplete);
    }

    private buildMenu() {
        const activePortal = this.resolveActivePortalSegment();
        const baseUrl = `/${activePortal}`;
        const items: MenuItem[] = [
            this.createNavItem('Dashboard', 'pi pi-th-large', `${baseUrl}/dashboard`, 'dashboard'),
            this.createNavItem('Profile', 'pi pi-user', `${baseUrl}/profile`, 'profile'),
            this.createNavItem('Payments', 'pi pi-credit-card', `${baseUrl}/payment`, 'payment'),
            this.createNavItem('Courses', 'pi pi-book', `${baseUrl}/courses`, 'courses'),
            {
                label: 'Log Out',
                icon: 'pi pi-sign-out',
                styleClass: 'menu-item-logout',
                command: () => this.logOut()
            }
        ];

        if (activePortal === 'new') {
            items.splice(2, 0, this.createNavItem('Admission', 'pi pi-book', `${baseUrl}/admissionform`, 'admissionform'));
            items.splice(4, 1);
        }

        this.model = this.filterMenu(items);
    }

    private createNavItem(label: string, icon: string, route: string, feature: ProtectedPageFeature): MenuItem {
        const disabled = !this.navigationAccess.canAccess(feature);
        return {
            label,
            icon,
            routerLink: [route],
            disabled,
            styleClass: disabled ? 'menu-item-disabled' : ''
        };
    }

    private logOut() {
        this.authSessionStore.clear();
        this.router.navigateByUrl('/auth/login');
    }

    private resolveActivePortalSegment(): 'new' | 'admitted' | 'returning' {
        const currentSegment = this.router.url.split('/').filter(Boolean)[0];
        if (currentSegment === 'new' || currentSegment === 'admitted' || currentSegment === 'returning') {
            return currentSegment;
        }
        return this.userPortalService.portalSegment();
    }

    private filterMenu(items: MenuItem[]): MenuItem[] {
        return items
            .map(n => ({ ...n }))
            .filter(n => {
                const needed = n['data']?.roles;
                if (!needed || needed.length === 0) return true;          // public item
                return this.permission.hasEveryRole(needed);              // <-- new helper
            })
            .map(n => {
                if (n.items?.length) n.items = this.filterMenu(n.items);
                return n;
            })
            .filter(n => (n.items?.length || n.routerLink || n.command || n.url));           // prune empty
    }
}
