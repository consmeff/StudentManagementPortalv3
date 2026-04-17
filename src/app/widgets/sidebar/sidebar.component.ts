import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { WidgetsService } from '../services/widgets.service';
import { sidebarStateDTO } from '../../data/dashboard/dash.dto';
import { TraceabilityModule } from '../../shared/traceability.module';

type SidebarMenuItem = {
  label: string;
  icon: string;
  route: string;
};

@Component({
  selector: 'app-sidebar',
  imports: [TraceabilityModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  sidebarVisible = false;
  readonly menuItems: SidebarMenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-th-large', route: '/pages/dashboard' },
    { label: 'Profile', icon: 'pi pi-user', route: '/pages/profile' },
    { label: 'Admission', icon: 'pi pi-book', route: '/pages/admissionform' },
    { label: 'Payments', icon: 'pi pi-credit-card', route: '/pages/payment' },
    { label: 'Results', icon: 'pi pi-chart-bar', route: '/pages/results' },
    { label: 'Documents', icon: 'pi pi-file', route: '/pages/documents' },
    { label: 'Support', icon: 'pi pi-question-circle', route: '/pages/support' },
  ];
  
  _widgetService = inject(WidgetsService);
  router = inject(Router);

  constructor() {
    this._widgetService.sidebarState$.subscribe((state: sidebarStateDTO) => {
      this.sidebarVisible = state.isvisible;
    });
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  onSidebarHide() {
    this._widgetService.setSidebarState({ isvisible: false });
  }

  close() {
    this._widgetService.setSidebarState({ isvisible: false });
  }

  logOut() {
    sessionStorage.clear();
    localStorage.removeItem('theme');
    setTimeout(() => {
      this.router.navigateByUrl('/auth/login');
    }, 300);
  }
}
