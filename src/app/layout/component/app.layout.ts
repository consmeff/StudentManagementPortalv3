import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppTopbar } from './app.topbar';
import { AppSidebar } from './app.sidebar';
import { AppFooter } from './app.footer';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppFooter],
    template: `
    <div class="layout-shell">
        <app-sidebar class="sidebar-pane"></app-sidebar>
        <section class="content-shell">
            <app-topbar></app-topbar>
            <div class="center-pane">
                <router-outlet></router-outlet>
                <app-footer></app-footer>
            </div>
        </section>
    </div> `,
    styles: [`
      :host {
        display: block;
        height: 100dvh;
      }
      .layout-shell {
        display: flex;
        height: 100dvh;
        width: 100%;
        background: var(--app-bg);
      }
      .sidebar-pane {
        flex: 0 0 auto;
        height: 100%;
      }
      .content-shell {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
        height: 100%;
      }
      .center-pane {
        flex: 1;
        overflow: auto;
        padding: 1rem;
        background: var(--app-surface);
      }
    `]
})
export class AppLayout {}
