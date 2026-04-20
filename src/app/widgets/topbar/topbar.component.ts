import { Component, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { MenuItem } from 'primeng/api';
import { WidgetsService } from '../services/widgets.service';
import { TraceabilityModule } from '../../shared/traceability.module';
import { ThemeService } from '../../services/theme.service';
import { AuthSessionStore } from '../../store/auth-session.store';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  imports: [TraceabilityModule],
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnDestroy {
  _widgetService = inject(WidgetsService);
  private readonly themeService = inject(ThemeService);
  private readonly authSessionStore = inject(AuthSessionStore);
  private themeSub?: Subscription;
  
  isDarkMode = false;
  username = '';
  userInitials = '';
  notificationCount = 3;
  messageCount = 2;

  notifications: MenuItem[] = [
    {
      label: 'Application Deadline Extended',
      icon: 'pi pi-info-circle',
      command: () => this.handleNotification(1)
    },
    {
      label: 'Payment Confirmation Received',
      icon: 'pi pi-check-circle',
      command: () => this.handleNotification(2)
    },
    {
      label: 'Document Verification Complete',
      icon: 'pi pi-file',
      command: () => this.handleNotification(3)
    }
  ];

  messages: MenuItem[] = [
    {
      label: 'Welcome to the portal',
      icon: 'pi pi-envelope',
      command: () => this.handleMessage(1)
    },
    {
      label: 'Update your profile',
      icon: 'pi pi-user-edit',
      command: () => this.handleMessage(2)
    }
  ];

  profileMenuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => this.navigateTo('/pages/profile')
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => this.navigateTo('/pages/settings')
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  constructor() {
    this.username = this.authSessionStore.name() || 'User';
    this.userInitials = this.getInitials(this.username);

    this.themeSub = this.themeService.darkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
    });
  }

  toggleSidebar() {
    this._widgetService.setSidebarState({ isvisible: true });
  }

  toggleDarkMode() {
    this.themeService.toggle();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  handleNotification(id: number) {
    console.log('Notification clicked:', id);
  }

  handleMessage(id: number) {
    console.log('Message clicked:', id);
  }

  navigateTo(route: string) {
    // Handle navigation
    console.log('Navigate to:', route);
  }

  logout() {
    this.authSessionStore.clear();
    window.location.href = '/auth/login';
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }
}
