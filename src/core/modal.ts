// App modals (C1) without a framework: the types and buttons behind openModal,
// alert and confirm, and the focus and backdrop rules of the native <dialog>.

import { tabbables } from './tabbable.ts';

export type CloseReason = 'button' | 'dismiss';

export type ModalSize = 'small' | 'medium' | 'large' | 'full';

export interface ModalButton<T> {
  label: string;
  value: T;
  /** Focus this button on open. Give it to the safe choice so a stray Enter never confirms. */
  autofocus?: boolean;
}

/** `openModal`'s options except `body`, whose type is each framework's own. */
export interface ModalBaseOptions<T> {
  title?: string;
  /** The dialog's name when there is neither `title` nor `message`. Default 'Dialog'. */
  label?: string;
  /** Plain text, rendered as a `<p>`. */
  message?: string;
  buttons?: ModalButton<T>[];
  size?: ModalSize;
  /** Where focus goes on close. Default: whatever had focus at open. */
  returnFocusEl?: HTMLElement | null;
}

/** `openModal`'s buttons when it is given none. */
export function defaultButtons<T>(): ModalButton<T>[] {
  return [{ label: 'Got it', value: true as T }];
}

/** `confirm`'s buttons: Cancel takes focus, so a stray Enter never confirms. */
export function confirmButtons(confirmLabel: string): ModalButton<boolean>[] {
  return [
    { label: 'Cancel', value: false, autofocus: true },
    { label: confirmLabel, value: true },
  ];
}

/**
 * Sets `autofocus` on the button in `row` that asks for it. Call it only
 * after insertion: WebKit queues a button inserted with `autofocus` as an
 * autofocus candidate and focuses it at a later rendering update, pulling
 * focus back to it after the user has already tabbed on. An attribute added
 * later is never a candidate.
 */
export function markAutofocus(row: Element, buttons: ModalButton<unknown>[]): void {
  const initial = buttons.findIndex((button) => button.autofocus);
  if (initial !== -1) row.children[initial].setAttribute('autofocus', '');
}

/**
 * The element to focus once the dialog is open. showModal() runs the dialog
 * focusing steps, but browsers disagree on the fallback when nothing has
 * `autofocus`; the APG wants the first focusable element.
 */
export function initialFocus(dialog: HTMLElement): HTMLElement | undefined {
  return dialog.querySelector<HTMLElement>('[autofocus]') ?? tabbables(dialog)[0];
}

/**
 * Wraps Tab and Shift+Tab around the dialog's tabbable elements. The native
 * modal keeps focus in the page but lets Tab leave for the browser's own UI;
 * the APG wraps it. The list is read on every Tab, so content added or
 * enabled while open is in the cycle. Call it from the dialog's keydown.
 */
export function wrapTab(
  dialog: HTMLElement,
  event: { key: string; shiftKey: boolean; defaultPrevented: boolean; preventDefault(): void },
): void {
  if (event.key !== 'Tab' || event.defaultPrevented) return;
  const list = tabbables(dialog);
  const active = dialog.ownerDocument.activeElement;
  if (list.length === 0) {
    event.preventDefault();
  } else if (event.shiftKey && (active === list[0] || active === dialog)) {
    event.preventDefault();
    list.at(-1)!.focus();
  } else if (!event.shiftKey && active === list.at(-1)) {
    event.preventDefault();
    list[0].focus();
  }
}

/**
 * Whether a pointer event landed on the dialog's backdrop. The backdrop is
 * part of the <dialog> box for hit-testing: a click there targets the dialog
 * itself, outside its border box.
 */
export function onBackdrop(
  dialog: HTMLElement,
  event: { target: EventTarget | null; clientX: number; clientY: number },
): boolean {
  if (event.target !== dialog) return false;
  const r = dialog.getBoundingClientRect();
  return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
}
