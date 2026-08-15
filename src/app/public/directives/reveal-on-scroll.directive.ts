import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

const REVEAL_CLASS = 'pub-reveal';
const REVEAL_VISIBLE_CLASS = 'pub-reveal--in';

/**
 * Reveals an element as it scrolls into view.
 *
 * Progressive enhancement: the hidden state is applied by this directive at
 * runtime, never in the template, so if JavaScript or IntersectionObserver is
 * unavailable the content simply renders visible instead of being stranded at
 * `opacity: 0`. Readers who ask for reduced motion are opted out entirely.
 *
 * Once the reveal animation finishes both classes are removed, returning the
 * element to its natural styles — otherwise the animation's filled end state
 * would outrank any `:hover` transform the component declares.
 *
 * Usage: `<div appReveal [revealDelay]="120">`
 */
@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  /** Stagger in milliseconds, for sequencing siblings. */
  readonly revealDelay = input(0);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  private observer?: IntersectionObserver;

  private cleanUp?: () => void;

  ngOnInit(): void {
    const element = this.host.nativeElement;

    const prefersReducedMotion =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const delay = this.revealDelay();
    if (delay > 0) {
      element.style.animationDelay = `${delay}ms`;
    }

    element.classList.add(REVEAL_CLASS);

    this.observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        this.reveal();
        // One-shot: the element stays revealed once seen.
        this.observer?.unobserve(element);
      },
      // Fire slightly before the element is fully on screen so the motion has
      // finished by the time it is centred.
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.cleanUp?.();
  }

  private reveal(): void {
    const element = this.host.nativeElement;

    const onAnimationEnd = (event: AnimationEvent): void => {
      if (event.animationName !== 'pub-reveal-in') {
        return;
      }

      element.classList.remove(REVEAL_CLASS, REVEAL_VISIBLE_CLASS);
      element.style.animationDelay = '';
      this.cleanUp?.();
    };

    element.addEventListener('animationend', onAnimationEnd);
    this.cleanUp = () => {
      element.removeEventListener('animationend', onAnimationEnd);
      this.cleanUp = undefined;
    };

    element.classList.add(REVEAL_VISIBLE_CLASS);
  }
}
