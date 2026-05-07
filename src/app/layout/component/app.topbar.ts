import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { WidgetsService } from '../../widgets/services/widgets.service';
import { ThemeService } from '../../services/theme.service';
import { AuthSessionStore } from '../../store/auth-session.store';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="top-bar">
        <div class="top-left">
            <button type="button" class="sidebar-trigger" aria-label="Open sidebar" (click)="toggleSidebar()">
                <i class="pi pi-bars"></i>
            </button>
            <div class="top-title">{{ currentModuleName }}</div>
        </div>
        <div class="top-right">
            <button type="button" class="top-icon-btn" (click)="toggleDarkMode()">
                <i class="pi" [class.pi-moon]="!isDarkMode" [class.pi-sun]="isDarkMode"></i>
            </button>
            <button type="button" class="top-icon-btn">
                <i class="pi pi-bell"></i>
            </button>
            <button type="button" class="top-icon-btn">
                <i class="pi pi-user"></i>
            </button>
            <div class="user-meta">
                <span>{{ username }}</span>
                <span>{{ companyName || 'Student Portal' }}</span>
            </div>
        </div>
    </div>`,
    styles: [`
      .top-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: .65rem 1rem;
        background-color: var(--app-surface-alt);
        box-shadow: var(--app-shadow-sm);
        border-bottom: 1px solid var(--app-border);
      }
      .top-left {
        display: flex;
        align-items: center;
      }
      .sidebar-trigger {
        display: none;
        width: 2.5rem;
        height: 2.5rem;
        margin-right: .75rem;
        border: 1px solid var(--app-border);
        border-radius: .5rem;
        background: var(--app-surface);
        color: var(--app-text-secondary);
      }
      .top-title {
        margin-left: .35rem;
        font-weight: 600;
      }
      .top-right {
        display: flex;
        align-items: center;
        gap: .4rem;
        color: var(--app-text-secondary);
      }
      .top-icon-btn {
        width: 2.2rem;
        height: 2.2rem;
        border: 1px solid var(--app-border);
        border-radius: .5rem;
        background: var(--app-surface);
        color: var(--app-text-secondary);
      }
      .user-meta {
        display: flex;
        flex-direction: column;
        margin-left: .25rem;
      }
      .user-meta span:first-child {
        font-weight: 600;
        font-size: 14px;
      }
      .user-meta span:last-child {
        font-weight: 400;
        font-size: 12px;
      }
      @media (max-width: 991px) {
        .sidebar-trigger {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      }
      @media (max-width: 575px) {
        .user-meta span:last-child {
          display: none;
        }
        .top-title {
          margin-left: 0;
          font-size: .95rem;
        }
      }
    `]
})
export class AppTopbar implements OnDestroy {
    private readonly theme = inject(ThemeService);
    private readonly authSessionStore = inject(AuthSessionStore);
    private readonly widgetService = inject(WidgetsService);
    private readonly router = inject(Router);
    private readonly subscriptions = new Subscription();

    username = '';
    companyName = '';
    isDarkMode = false;
    currentModuleName = 'Dashboard';

    constructor() {
        this.username = this.authSessionStore.name() || 'User';
        this.companyName = this.authSessionStore.userType() || '';
        this.currentModuleName = this.resolveModuleName(this.router.url);
        this.subscriptions.add(
            this.router.events
                .pipe(filter((event) => event instanceof NavigationEnd))
                .subscribe((event) => {
                    const navigation = event as NavigationEnd;
                    this.currentModuleName = this.resolveModuleName(navigation.urlAfterRedirects);
                })
        );
        this.subscriptions.add(
            this.theme.darkMode$.subscribe((isDark) => {
                this.isDarkMode = isDark;
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    toggleSidebar(): void {
        this.widgetService.setSidebarState({ isvisible: true });
    }

    toggleDarkMode(): void {
        this.theme.toggle();
    }

    private resolveModuleName(url: string): string {
        if (url.includes('/admitted/courses') || url.includes('/new/courses') || url.includes('/returning/courses')) {
            return 'Courses';
        }
        if (url.includes('/results')) {
            return 'Results';
        }
        if (url.includes('/cgpa-tracker')) {
            return 'CGPA Tracker';
        }
        if (url.includes('/hostel')) {
            return 'Hostel';
        }
        if (url.includes('/payment')) {
            return 'Payments';
        }
        if (url.includes('/profile')) {
            return 'Profile';
        }
        if (url.includes('/admissionform')) {
            return 'Admission';
        }
        return 'Dashboard';
    }
}
