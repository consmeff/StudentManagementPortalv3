import { Component, HostListener, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { PUBLIC_NAV_ITEMS, PublicNavItem } from '../../public-nav.config';
import { HERO_CONTENT } from '../../data/public-content.data';
import { PublicBrandComponent } from '../public-brand/public-brand.component';

/**
 * Sticky masthead for the public site.
 *
 * Collapses to a disclosure menu below the `lg` breakpoint. The panel closes on
 * navigation and on Escape so keyboard users are never trapped behind it.
 */
@Component({
  selector: 'app-public-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, PublicBrandComponent],
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.scss'
})
export class PublicHeaderComponent {
  readonly navItems: PublicNavItem[] = PUBLIC_NAV_ITEMS;

  readonly applyRoute = HERO_CONTENT.ctaRoute;

  readonly applyLabel = HERO_CONTENT.ctaLabel;

  /** Existing applicants and students returning to the portal. */
  readonly loginRoute = '/auth/login';

  readonly menuOpen = signal(false);

  constructor(router: Router) {
    router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.menuOpen.set(false));
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }
}
