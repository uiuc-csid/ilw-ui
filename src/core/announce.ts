export type Politeness = 'polite' | 'assertive';

export interface AnnounceOptions {
  /** `polite` (default) waits for the screen reader to finish; `assertive` interrupts it. */
  politeness?: Politeness;
}

// Created on the first call, never at import time: this module also loads on the server.
const regions = new Map<Politeness, HTMLElement>();
const pending = new Map<Politeness, number>();

function region(politeness: Politeness): HTMLElement {
  const existing = regions.get(politeness);
  // A page that swapped out <body> took the old region with it.
  if (existing?.isConnected) return existing;
  const el = document.createElement('div');
  el.setAttribute('role', politeness === 'assertive' ? 'alert' : 'status');
  el.setAttribute('aria-atomic', 'true');
  el.className = 'ilw-visually-hidden';
  el.dataset.ilwAnnounce = politeness;
  document.body.append(el);
  regions.set(politeness, el);
  return el;
}

/**
 * Speaks `message` through a shared, visually hidden live region. The text is
 * cleared now and set on the next frame, so repeating a message announces it
 * again; a newer message replaces one that hasn't been set yet.
 */
export function announce(message: string, { politeness = 'polite' }: AnnounceOptions = {}): void {
  const el = region(politeness);
  const frame = pending.get(politeness);
  if (frame !== undefined) cancelAnimationFrame(frame);
  el.textContent = '';
  pending.set(
    politeness,
    requestAnimationFrame(() => {
      pending.delete(politeness);
      el.textContent = message;
    }),
  );
}
