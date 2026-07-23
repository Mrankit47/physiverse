/* ═══════════════════════════════════════════════════════════════
   PHYSIVERSE — Accessibility Manager
   Keyboard navigation, screen reader support, reduced motion,
   high contrast, and touch optimization for 3D scenes.
   ═══════════════════════════════════════════════════════════════ */

/** Announce a message to screen readers via a live region */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof document === 'undefined') return;

  const id = 'physiverse-sr-announcer';
  let el = document.getElementById(id);

  if (!el) {
    el = document.createElement('div');
    el.id = id;
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', priority);
    el.setAttribute('aria-atomic', 'true');
    el.style.cssText =
      'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;padding:0;margin:-1px;';
    document.body.appendChild(el);
  }

  // Clear and re-set to trigger announcement
  el.textContent = '';
  requestAnimationFrame(() => {
    el!.textContent = message;
  });
}

/** Check if the user prefers reduced motion */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Check if the user prefers high contrast */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: more)').matches;
}

/** Check if the user is using a touch device */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/** Focus trap for modal/panel accessibility */
export class FocusTrap {
  private container: HTMLElement;
  private previousFocus: Element | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  activate(): void {
    this.previousFocus = document.activeElement;
    const focusable = this.getFocusableElements();
    if (focusable.length > 0) {
      (focusable[0] as HTMLElement).focus();
    }
    this.container.addEventListener('keydown', this.handleKeyDown);
  }

  deactivate(): void {
    this.container.removeEventListener('keydown', this.handleKeyDown);
    if (this.previousFocus instanceof HTMLElement) {
      this.previousFocus.focus();
    }
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== 'Tab') return;

    const focusable = this.getFocusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  private getFocusableElements(): NodeListOf<Element> {
    return this.container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }
}

/** Generate ARIA labels for 3D visualization elements */
export function getVisualizationAriaLabel(
  title: string,
  category: string,
  difficulty: string
): string {
  return `${title} — ${category} visualization, ${difficulty} difficulty. Use keyboard shortcuts to interact. Press ? for help.`;
}

/** Accessibility-friendly description for animation states */
export function getAnimationStateDescription(
  isPlaying: boolean,
  progress: number,
  speed: number
): string {
  if (!isPlaying) return 'Animation paused';
  return `Animation playing at ${speed}x speed, ${Math.round(progress * 100)}% complete`;
}

/** Generate skip-to-content link data */
export function getSkipLinks(): { id: string; label: string }[] {
  return [
    { id: 'main-content', label: 'Skip to main content' },
    { id: 'visualization', label: 'Skip to visualization' },
    { id: 'controls', label: 'Skip to controls' },
    { id: 'theory', label: 'Skip to theory' },
  ];
}
