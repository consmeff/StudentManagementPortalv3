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

    constructor(
        private permission: PermissionService,
        private regstore: RegStoreService,
        private router: Router,
        private navigationAccess: NavigationAccessService
    ) {
        effect(() => {
            this.authSessionStore.paymentStatus();
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
        this.model = this.filterMenu([
            this.createNavItem('Dashboard', 'pi pi-th-large', '/pages/dashboard', 'dashboard'),
            this.createNavItem('Profile', 'pi pi-user', '/pages/profile', 'profile'),
            this.createNavItem('Admission', 'pi pi-book', '/pages/admissionform', 'admissionform'),
            this.createNavItem('Payments', 'pi pi-credit-card', '/pages/payment', 'payment'),
            {
                label: 'Log Out',
                icon: 'pi pi-sign-out',
                styleClass: 'menu-item-logout',
                command: () => this.logOut()
            }
        ]);
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
