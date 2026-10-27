// App modals on a native <dialog> opened with showModal(), styled by
// modal.css after the toolkit's <ilw-modal>.
//
// openModal() mounts a Modal on document.body, opens it, and resolves with the
// `value` of the button the user clicked, or null if they closed it some other
// way (the × button, a click on the backdrop, or Escape). While it is open the
// browser makes the rest of the page inert. Once closed it is removed from the
// DOM and focus returns to `returnFocusEl`.

import { mount, type Snippet, unmount } from 'svelte';

import { nextId } from '../core/index.ts';
import { confirmButtons, defaultButtons, type ModalBaseOptions } from '../core/modal.ts';
import Modal from './Modal.svelte';

export type { CloseReason, ModalButton, ModalSize } from '../core/modal.ts';

export interface ModalOptions<T> extends ModalBaseOptions<T> {
  /** Rich content; takes precedence over `message`. */
  body?: Snippet;
}

export async function openModal<T = true>({
  title = '',
  label,
  body,
  message = '',
  buttons = defaultButtons<T>(),
  size = 'small',
  returnFocusEl = document.activeElement as HTMLElement | null,
}: ModalOptions<T> = {}): Promise<T | null> {
  const id = nextId('app-modal');
  return new Promise((resolve) => {
    const component = mount(Modal<T>, {
      target: document.body,
      props: {
        id,
        title,
        label,
        size,
        body,
        message,
        buttons,
        onclose: (_reason, value) => {
          unmount(component);
          returnFocusEl?.focus();
          resolve(value);
        },
      },
    });
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
    buttons: confirmButtons(confirmLabel),
  });
  return choice === true;
}
