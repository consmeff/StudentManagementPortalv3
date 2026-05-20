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
                <div class="page-pane">
                    <router-outlet></router-outlet>
                </div>
              </div>
              <app-footer></app-footer>
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
        display: flex;
        flex-direction: column;
        min-height: 0;
        overflow: hidden;
        padding: 1rem;
        background: var(--app-surface);
      }
      .page-pane {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
      }
      .page-pane > router-outlet {
        display: contents;
      }
      .page-pane > :not(router-outlet) {
        flex: 1 1 auto;
        min-height: 0;
      }
      app-footer {
        display: block;
        flex-shrink: 0;
      }
    `]
})
export class AppLayout { }
