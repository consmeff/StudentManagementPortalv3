import { AfterViewInit, Component, ElementRef, OnDestroy, inject, input, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PublicContentService } from '../../services/public-content.service';
import { PublicImageComponent } from '../../components/public-image/public-image.component';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

/** Matches the `gap` on `.facilities__track`. */
const TRACK_GAP_PX = 24;

@Component({
  selector: 'app-facilities-section',
  standalone: true,
  imports: [PublicImageComponent, RevealOnScrollDirective],
  templateUrl: './facilities-section.component.html',
  styleUrl: './facilities-section.component.scss'
})
export class FacilitiesSectionComponent implements AfterViewInit, OnDestroy {
  private readonly content = inject(PublicContentService);

  readonly heading = input('Unique Facilities we have');

  readonly facilities = toSignal(this.content.getFacilities(), { initialValue: [] });

  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');

  /**
   * Arrow affordances. Both start false so the controls stay hidden until we
   * have measured — a scroller that fits its content shows no arrows at all.
   */
  readonly canScrollPrev = signal(false);

  readonly canScrollNext = signal(false);

  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.updateScrollState();

    const element = this.scroller()?.nativeElement;
    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }

    // Card width is viewport-dependent, so re-measure when the box changes
    // rather than only on window resize.
    this.resizeObserver = new ResizeObserver(() => this.updateScrollState());
    this.resizeObserver.observe(element);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  updateScrollState(): void {
    const element = this.scroller()?.nativeElement;
    if (!element) {
      return;
    }

    const maxScroll = element.scrollWidth - element.clientWidth;
    // Tolerance absorbs sub-pixel rounding at fractional zoom levels.
    this.canScrollPrev.set(element.scrollLeft > 1);
    this.canScrollNext.set(element.scrollLeft < maxScroll - 1);
  }

  scrollBy(direction: -1 | 1): void {
    const element = this.scroller()?.nativeElement;
    if (!element) {
      return;
    }

    const card = element.querySelector<HTMLElement>('.facilities__item');
    const step = (card?.offsetWidth ?? element.clientWidth * 0.8) + TRACK_GAP_PX;

    element.scrollBy({ left: step * direction, behavior: 'smooth' });
  }
}
