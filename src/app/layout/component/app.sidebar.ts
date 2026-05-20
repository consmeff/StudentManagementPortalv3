import { CommonModule } from '@angular/common';
import { Component, HostListener, effect, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { WidgetsService } from '../../widgets/services/widgets.service';
import { NavigationAccessService, ProtectedPageFeature } from '../../services/navigation-access.service';
import { AuthSessionStore } from '../../store/auth-session.store';
import { UserPortalService } from '../../services/user-portal.service';

type SidebarMenuItem = {
    label: string;
    iconClass: string;
    route: string;
    feature: ProtectedPageFeature;
    disabled?: boolean;
};

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    @if (isMobileDrawerOpen) {
      <button type="button" class="sidebar-backdrop" aria-label="Close sidebar" (click)="close()"></button>
    }

    <div
      class="sidebar-shell"
      [class.is-collapsed]="isDesktopCollapsed"
      [class.is-mobile]="isMobileViewport"
      [class.is-mobile-open]="isMobileDrawerOpen"
    >
      <div class="sidebar-top-row">
        @if (!isDesktopCollapsed) {
          <div class="brand-wrap">
            <img src="/assets/consmmefs-logo.png" alt="School Logo" />
          </div>
        }
        <button type="button" class="collapse-btn" (click)="toggleSidebar()">
          <i class="pi" [class.pi-angle-left]="sidebarVisible" [class.pi-angle-right]="!sidebarVisible"></i>
        </button>
      </div>

      <nav class="menu-list">
        @for (item of menuItems; track item.route) {
          <a
            class="menu-link"
            [class.active-link]="isRouteActive(item.route)"
            [class.disabled-link]="item.disabled"
            [routerLink]="item.disabled ? null : item.route"
            [attr.data-tooltip]="item.label"
            (click)="onNavigate(item)"
          >
            <i [class]="item.iconClass"></i>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <button type="button" class="logout-btn" data-tooltip="Log Out" (click)="logOut()">
        <i class="pi pi-sign-out"></i>
        <span>Log Out</span>
      </button>
    </div>
    `,
    styles: [`
      .sidebar-shell {
        width: 15rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        z-index: 30;
        background: var(--app-surface);
        border-right: 1px solid var(--app-border);
        padding: 16px;
        overflow: hidden;
        transform: translateX(0);
        transition: width .3s ease, padding .3s ease, transform .3s ease;
      }
      .sidebar-backdrop {
        position: fixed;
        inset: 0;
        border: 0;
        background: rgba(15, 23, 42, 0.45);
        z-index: 29;
      }
      .sidebar-shell.is-collapsed {
        width: 5.25rem;
        padding: 12px 8px;
      }
      .sidebar-top-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 28px;
      }
      .collapse-btn {
        width: 1.75rem;
        height: 1.75rem;
        border: 1px solid var(--app-border);
        border-radius: 0.45rem;
        background: var(--app-surface);
        color: var(--app-text-secondary);
      }
      .brand-wrap img {
        width: 48px;
        height: auto;
      }
      .menu-list {
        display: grid;
      }
      .menu-link {
        display: flex;
        align-items: center;
        gap: .75rem;
        text-decoration: none;
        color: var(--app-text-secondary);
        font-size: 15px;
        font-weight: 500;
        padding: 10px 8px;
        border-bottom: 1px solid var(--app-border);
      }
      .menu-link i {
        font-size: 1.2rem;
      }
      .menu-link.active-link {
        color: var(--app-primary);
        font-weight: 700;
      }
      .menu-link.active-link i {
        color: var(--app-primary);
      }
      .menu-link.disabled-link {
        opacity: .45;
        pointer-events: none;
      }
      .logout-btn {
        margin-top: auto;
        border: none;
        background: transparent;
        color: #f43f5e;
        display: inline-flex;
        align-items: center;
        gap: .55rem;
        font-size: 14px;
        font-weight: 700;
      }
      .sidebar-shell.is-collapsed .menu-link {
        justify-content: center;
      }
      .sidebar-shell.is-collapsed .menu-link span,
      .sidebar-shell.is-collapsed .logout-btn span {
        display: none;
      }
      .sidebar-shell.is-collapsed .logout-btn {
        justify-content: center;
      }
      .sidebar-shell.is-collapsed .menu-link::after,
      .sidebar-shell.is-collapsed .logout-btn::after {
        content: attr(data-tooltip);
        position: absolute;
        left: calc(100% + 12px);
        top: 50%;
        transform: translateY(-50%);
        background: var(--app-surface-alt);
        color: var(--app-text-primary);
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
        padding: 7px 9px;
        border-radius: 6px;
        opacity: 0;
        pointer-events: none;
      }
      .sidebar-shell.is-collapsed .menu-link:hover::after,
      .sidebar-shell.is-collapsed .logout-btn:hover::after {
        opacity: 1;
      }
      @media (max-width: 991px) {
        .sidebar-shell {
          position: fixed;
          top: 0;
          left: 0;
          width: min(18rem, 84vw);
          height: 100dvh;
          transform: translateX(-100%);
          padding: 16px;
          overflow-y: auto;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
          z-index: 30;
        }
        .sidebar-shell.is-mobile-open {
          transform: translateX(0);
        }
        .sidebar-shell.is-collapsed {
          width: min(18rem, 84vw);
          padding: 16px;
        }
        .sidebar-shell.is-collapsed .menu-link {
          justify-content: flex-start;
        }
        .sidebar-shell.is-collapsed .menu-link span,
        .sidebar-shell.is-collapsed .logout-btn span {
          display: inline;
        }
      }
    `]
})
export class AppSidebar {
    private readonly widgetService = inject(WidgetsService);
    private readonly router = inject(Router);
    private readonly authSessionStore = inject(AuthSessionStore);
    private readonly navigationAccess = inject(NavigationAccessService);
    private readonly userPortalService = inject(UserPortalService);

    sidebarVisible = true;
    isMobileViewport = false;
    menuItems: SidebarMenuItem[] = [];

    constructor() {
        this.widgetService.sidebarState$.subscribe((state) => {
            this.sidebarVisible = state.isvisible;
        });
        effect(() => {
            this.authSessionStore.paymentStatus();
            this.authSessionStore.acceptanceFeeStatus();
            this.authSessionStore.userType();
            this.authSessionStore.matriculationNo();
            this.buildMenu();
        });
        this.updateViewportState();
        this.buildMenu();
    }

    @HostListener('window:resize')
    onWindowResize(): void {
        this.updateViewportState();
    }

    get isDesktopCollapsed(): boolean {
        return !this.sidebarVisible && !this.isMobileViewport;
    }

    get isMobileDrawerOpen(): boolean {
        return this.isMobileViewport && this.sidebarVisible;
    }

    toggleSidebar(): void {
        this.widgetService.setSidebarState({ isvisible: !this.sidebarVisible });
    }

    close(): void {
        this.widgetService.setSidebarState({ isvisible: false });
    }

    isRouteActive(route: string): boolean {
        if (this.isNewCandidateAdmissionProfileRoute(route)) {
            return true;
        }
        return this.router.url.startsWith(route);
    }

    onNavigate(item: SidebarMenuItem): void {
        if (item.disabled) {
            return;
        }
        if (this.isMobileViewport) {
            this.close();
        }
    }

    logOut(): void {
        this.authSessionStore.clear();
        this.router.navigateByUrl('/auth/login');
    }

    private buildMenu(): void {
        const activePortal = this.resolveActivePortalSegment();
        const baseUrl = `/${activePortal}`;
        let items: SidebarMenuItem[] = [
            this.createNavItem('Dashboard', 'pi pi-th-large', `${baseUrl}/dashboard`, 'dashboard'),
            this.createNavItem('Profile', 'pi pi-user', `${baseUrl}/profile`, 'profile'),
            this.createNavItem('Payments', 'pi pi-credit-card', `${baseUrl}/payment`, 'payment'),
            this.createNavItem('Courses', 'pi pi-book', `${baseUrl}/courses`, 'courses')
        ];

        if (activePortal === 'new') {
            items = [
                this.createNavItem('Dashboard', 'pi pi-th-large', `${baseUrl}/dashboard`, 'dashboard'),
                this.createNavItem('Profile', 'pi pi-user', `${baseUrl}/profile`, 'profile'),
                this.createNavItem('Payments', 'pi pi-credit-card', `${baseUrl}/payment`, 'payment')
            ];
        } else if (activePortal === 'admitted') {
            items = [
                this.createNavItem('Dashboard', 'pi pi-th-large', `${baseUrl}/dashboard`, 'dashboard'),
                this.createNavItem('Profile', 'pi pi-user', `${baseUrl}/profile`, 'profile'),
                this.createNavItem('Payments', 'pi pi-credit-card', `${baseUrl}/payment`, 'payment'),
                this.createNavItem('Courses', 'pi pi-book', `${baseUrl}/courses`, 'courses')
            ];
        } else if (activePortal === 'returning') {
            items = [
                this.createNavItem('Dashboard', 'pi pi-th-large', `${baseUrl}/dashboard`, 'dashboard'),
                this.createNavItem('Courses', 'pi pi-book', `${baseUrl}/courses`, 'courses'),
                this.createNavItem('Results', 'pi pi-file', `${baseUrl}/results`, 'results'),
                this.createNavItem('Payments', 'pi pi-credit-card', `${baseUrl}/payment`, 'payment'),
                this.createNavItem('CGPA Tracker', 'pi pi-chart-line', `${baseUrl}/cgpa-tracker`, 'cgpaTracker'),
                this.createNavItem('Hostel', 'pi pi-home', `${baseUrl}/hostel`, 'hostel'),
                this.createNavItem('Profile', 'pi pi-user', `${baseUrl}/profile`, 'profile')
            ];
        }
        this.menuItems = items;
    }

    private createNavItem(label: string, iconClass: string, route: string, feature: ProtectedPageFeature): SidebarMenuItem {
        return {
            label,
            iconClass,
            route,
            feature,
            disabled: !this.navigationAccess.canAccess(feature)
        };
    }

    private resolveActivePortalSegment(): 'new' | 'admitted' | 'returning' {
        const currentSegment = this.router.url.split('/').filter(Boolean)[0];
        if (currentSegment === 'new' || currentSegment === 'admitted' || currentSegment === 'returning') {
            return currentSegment;
        }
        return this.userPortalService.portalSegment();
    }

    private updateViewportState(): void {
        const mobileViewport = window.innerWidth <= 991;
        const viewportChanged = mobileViewport !== this.isMobileViewport;
        this.isMobileViewport = mobileViewport;

        if (mobileViewport && (viewportChanged || this.sidebarVisible)) {
            this.widgetService.setSidebarState({ isvisible: false });
            return;
        }
        if (!mobileViewport && viewportChanged && !this.sidebarVisible) {
            this.widgetService.setSidebarState({ isvisible: true });
        }
    }

    private isNewCandidateAdmissionProfileRoute(route: string): boolean {
        return route.endsWith('/profile') && this.router.url.startsWith('/new/admissionform');
    }
}
