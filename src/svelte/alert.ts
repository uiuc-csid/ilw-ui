// Dismissing an alert (E1): where focus goes when the alert it was in is
// removed, and the progressive enhancement of server-rendered alerts' dismiss
// buttons. Alert.svelte uses the same focus rule.

import { tabbables } from '../core/index.ts';

/**
 * Where focus goes once `alert` is gone: the next tabbable element after it,
 * else the one before it, else `<main>` (made focusable by script if it isn't).
 * Call it while the alert is still in the document.
 */
export function focusTargetAfter(alert: HTMLElement): HTMLElement | null {
  const doc = alert.ownerDocument;
  const outside = tabbables(doc.body).filter((el) => !alert.contains(el));
  const next = outside.find((el) => alert.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
  const previous = outside.findLast((el) => alert.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING);
  if (next ?? previous) return next ?? previous!;
  const main = alert.closest('main') ?? doc.querySelector('main');
  if (main && !main.hasAttribute('tabindex')) main.tabIndex = -1;
  return main;
}

/** True when focus is in `alert`, or has already fallen to `<body>` (or nowhere). */
export function focusLost(alert: HTMLElement): boolean {
  const active = alert.ownerDocument.activeElement;
  return !active || active === alert.ownerDocument.body || alert.contains(active) || !active.isConnected;
}

/**
 * Removes a server-rendered `.ilw-alert`, moving focus to `focusTargetAfter()`
 * if it was inside. Dispatches a cancelable, bubbling `ilw-alert-dismiss`
 * event on the alert first; cancelling it keeps the alert.
 */
export function dismissAlert(alert: HTMLElement): void {
  if (!alert.dispatchEvent(new Event('ilw-alert-dismiss', { bubbles: true, cancelable: true }))) return;
  const target = focusTargetAfter(alert);
  const moveFocus = focusLost(alert);
  alert.remove();
  if (moveFocus) target?.focus();
}

/**
 * Wires the dismiss buttons of server-rendered alerts in `root`: each
 * `.ilw-alert-dismiss[hidden]` is shown and dismisses its alert. Buttons
 * already wired are skipped, so it is safe to call again on new content.
 * Returns a cleanup that unwires (and hides) them again.
 */
export function enhanceAlerts(root: ParentNode = document): () => void {
  const wired: [HTMLButtonElement, () => void][] = [];
  for (const button of root.querySelectorAll<HTMLButtonElement>('.ilw-alert .ilw-alert-dismiss[hidden]')) {
    const alert = button.closest<HTMLElement>('.ilw-alert')!;
    const onclick = () => dismissAlert(alert);
    button.addEventListener('click', onclick);
    button.hidden = false;
    wired.push([button, onclick]);
  }
  return () => {
    for (const [button, onclick] of wired) {
      button.removeEventListener('click', onclick);
      button.hidden = true;
    }
  };
}
