import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { LayoutService } from '../layout/service/layout.service';

const THEME_STORAGE_KEY = 'student-portal-theme';
const DARK_THEME_VALUE = 'dark';
const LIGHT_THEME_VALUE = 'light';

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
    if (typeof globalThis === 'undefined') {
      return false;
    }

    const storedValue = globalThis.localStorage?.getItem(THEME_STORAGE_KEY);
    if (storedValue === DARK_THEME_VALUE) {
      return true;
    }
    if (storedValue === LIGHT_THEME_VALUE) {
      return false;
    }

    return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }

  private applyDomClasses(isDark: boolean): void {
    if (typeof document === 'undefined') {
      return;
    }

    const themeValue = isDark ? DARK_THEME_VALUE : LIGHT_THEME_VALUE;
    document.documentElement.classList.toggle('app-dark', isDark);
    document.documentElement.dataset['theme'] = themeValue;
    document.body.classList.toggle('dark', isDark);

    if (typeof globalThis !== 'undefined') {
      globalThis.localStorage?.setItem(THEME_STORAGE_KEY, themeValue);
    }
  }
}
