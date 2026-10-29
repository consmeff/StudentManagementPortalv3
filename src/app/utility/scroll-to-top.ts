export function scrollToPageTop(origin: HTMLElement | null): void {
  globalThis.scrollTo({ top: 0, behavior: 'smooth' });

  let scrollableAncestor = origin?.parentElement ?? null;
  while (scrollableAncestor) {
    if (scrollableAncestor.scrollTop > 0) {
      scrollableAncestor.scrollTo({ top: 0, behavior: 'smooth' });
    }
    scrollableAncestor = scrollableAncestor.parentElement;
  }
}
