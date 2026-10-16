// App modals, built on the Illinois toolkit's <ilw-modal>. The host page must
// load the toolkit.
//
// openModal() mounts a Modal on document.body, opens it, and resolves with the
// `value` of the button the user clicked, or null if they closed it some other
// way (the × button, a click on the backdrop, or Escape). While it is open the
// rest of the page is inert. Once closed it is removed from the DOM and focus
// returns to `returnFocusEl`.

import { mount, type Snippet, unmount } from 'svelte';

import { nextId } from '../core/index.ts';
import Modal from './Modal.svelte';

export type CloseReason = 'button' | 'dismiss';

export interface ModalButton<T> {
  label: string;
  value: T;
  /** Focus this button on open. Give it to the safe choice so a stray Enter never confirms. */
  autofocus?: boolean;
}

export interface ModalOptions<T> {
  title?: string;
  /** Rich content; takes precedence over `message`. */
  body?: Snippet;
  /** Plain text, rendered as a `<p>`. */
  message?: string;
  buttons?: ModalButton<T>[];
  size?: 'small' | 'medium' | 'large' | 'full';
  /** Where focus goes on close. Default: whatever had focus at open. */
  returnFocusEl?: HTMLElement | null;
}

export async function openModal<T = true>({
  title = '',
  body,
  message = '',
  buttons = [{ label: 'Got it', value: true as T }],
  size = 'small',
  returnFocusEl = document.activeElement as HTMLElement | null,
}: ModalOptions<T> = {}): Promise<T | null> {
  await customElements.whenDefined('ilw-modal');
  // ilw-modal also opens on clicks of [data-modal-target=<id>]; a unique id
  // keeps it from answering anyone else's trigger.
  const id = nextId('app-modal');
  return new Promise((resolve) => {
    const before = new Set(document.body.children);
    const priorInert = new Map<HTMLElement, boolean>();
    const component = mount(Modal<T>, {
      target: document.body,
      props: {
        id,
        title,
        size,
        body,
        message,
        buttons,
        onclose: (_reason, value) => {
          unmount(component);
          // Restore before focusing: an inert element can't take focus.
          for (const [el, inert] of priorInert) el.inert = inert;
          returnFocusEl?.focus();
          resolve(value);
        },
      },
    });
    for (const el of before) {
      if (el instanceof HTMLElement) {
        priorInert.set(el, el.inert);
        el.inert = true;
      }
    }
  });
}

/** A notice with one button, in place of window.alert. Resolves once dismissed. */
export async function alert({
  title,
  message,
  returnFocusEl,
}: {
  title?: string;
  message: string;
  returnFocusEl?: HTMLElement | null;
}): Promise<void> {
  await openModal({ title, message, returnFocusEl });
}

/**
 * A yes/no question, in place of window.confirm. Resolves true only when the
 * user clicks `confirmLabel`. Cancel takes focus, so a stray Enter never
 * confirms; Escape, × and the backdrop all cancel.
 */
export async function confirm({
  title,
  message,
  confirmLabel,
  returnFocusEl,
}: {
  title?: string;
  message: string;
  confirmLabel: string;
  returnFocusEl?: HTMLElement | null;
}): Promise<boolean> {
  const choice = await openModal({
    title,
    message,
    returnFocusEl,
    buttons: [
      { label: 'Cancel', value: false, autofocus: true },
      { label: confirmLabel, value: true },
    ],
  });
  return choice === true;
}
