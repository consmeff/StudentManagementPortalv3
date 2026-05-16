import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { GlobalLoadingComponent } from './app/global-loader/global-loader.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, GlobalLoadingComponent],
    template: `
    <p-toast position="top-right"></p-toast>
    <router-outlet></router-outlet>
    <app-global-loading></app-global-loading>
    `
})
export class AppComponent {}
