import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { LayoutService } from '../layout/service/layout.service';


@Injectable({ providedIn: 'root' })
export class ThemeService {
  /* ---------- state ---------- */
  private _dark = signal<boolean>(this.initialValue());

  /* ---------- public API ---------- */
  readonly darkMode$ = toObservable(this._dark);

  constructor(private layoutService: LayoutService) {
    this.darkMode$.subscribe((isDark) => {
      this.applyDomClasses(isDark);
      this.layoutService.layoutConfig.update((s) => ({ ...s, darkTheme: isDark }));
    });
  }

  /* manual toggle (called by header button) */
  toggle(): void {
    this.setDarkMode(!this._dark());
  }

  setDarkMode(isDark: boolean): void {
    this._dark.set(isDark);
  }

  isDark(): boolean {
    return this._dark();
  }

  /* ---------- helpers ---------- */
  private initialValue(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyDomClasses(isDark: boolean): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.classList.toggle('app-dark', isDark);
    document.body.classList.toggle('dark', isDark);
  }
}
