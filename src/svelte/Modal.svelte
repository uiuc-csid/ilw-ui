<script lang="ts" generics="T">
  import { onMount, type Snippet } from 'svelte';

  import { nextId, tabbables } from '../core/index.ts';
  import type { CloseReason, ModalButton, ModalSize } from './modal.ts';

  let {
    id = nextId('ilw-modal'),
    title = '',
    label = 'Dialog',
    size = 'small',
    body,
    message = '',
    buttons,
    onclose,
  }: {
    id?: string;
    /** Rendered as the `<h2>` that names the dialog. */
    title?: string;
    /** The dialog's name when there is neither `title` nor `message`. */
    label?: string;
    size?: ModalSize;
    /** Rich content; takes precedence over `message`. */
    body?: Snippet;
    /** Plain text, rendered as a `<p>`: the dialog's description (its name if there is no title). */
    message?: string;
    buttons: ModalButton<T>[];
    /** Called once, when the modal closes: the clicked button's value, or null when dismissed. */
    onclose: (reason: CloseReason, value: T | null) => void;
  } = $props();

  let dialog: HTMLDialogElement;
  let row: HTMLElement;
  let closed = false;
  // Where the current click started: a drag from the content to the backdrop isn't a backdrop click.
  let downOnBackdrop = false;

  const titleId = $derived(`${id}-title`);
  const messageId = $derived(`${id}-message`);
  const hasMessage = $derived(!body && !!message);
  const labelledby = $derived(title ? titleId : hasMessage ? messageId : undefined);

  onMount(() => {
    // Mark the initial button only now, after insertion: WebKit queues a
    // button inserted with `autofocus` as an autofocus candidate and focuses
    // it at a later rendering update, pulling focus back to it after the user
    // has already tabbed on. An attribute added later is never a candidate.
    const initial = buttons.findIndex((button) => button.autofocus);
    if (initial !== -1) row.children[initial].setAttribute('autofocus', '');
    dialog.showModal();
    // showModal() runs the dialog focusing steps, but browsers disagree on
    // the fallback when nothing has `autofocus`; the APG wants the first
    // focusable element.
    (dialog.querySelector<HTMLElement>('[autofocus]') ?? tabbables(dialog)[0])?.focus();
  });

  function handleClose() {
    if (closed) return;
    closed = true;
    // A choice button submits the form with its index as `returnValue`;
    // Escape, × and the backdrop leave it empty.
    const chosen = dialog.returnValue === '' ? undefined : buttons[Number(dialog.returnValue)];
    if (chosen) onclose('button', chosen.value);
    else onclose('dismiss', null);
  }

  // The native modal keeps focus in the page but lets Tab leave for the
  // browser's own UI; the APG wraps it. The list is read on every Tab, so
  // content added or enabled while open is in the cycle.
  function handleKeydown(e: KeyboardEvent) {
    if (e.key !== 'Tab' || e.defaultPrevented) return;
    const list = tabbables(dialog);
    const active = document.activeElement;
    if (list.length === 0) {
      e.preventDefault();
    } else if (e.shiftKey && (active === list[0] || active === dialog)) {
      e.preventDefault();
      list.at(-1)!.focus();
    } else if (!e.shiftKey && active === list.at(-1)) {
      e.preventDefault();
      list[0].focus();
    }
  }

  // The backdrop is part of the <dialog> box for hit-testing: a click there
  // targets the dialog itself, outside its border box.
  function outside(e: MouseEvent) {
    if (e.target !== dialog) return false;
    const r = dialog.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  }
</script>

<dialog
  bind:this={dialog}
  {id}
  class="ilw-modal ilw-modal--{size}"
  aria-labelledby={labelledby}
  aria-label={labelledby ? undefined : label}
  aria-describedby={title && hasMessage ? messageId : undefined}
  onclose={handleClose}
  onkeydown={handleKeydown}
  onpointerdown={(e) => (downOnBackdrop = outside(e))}
  onclick={(e) => {
    if (downOnBackdrop && outside(e)) dialog.close();
    downOnBackdrop = false;
  }}
>
  {#if title}<h2 class="ilw-modal-title" id={titleId}>{title}</h2>{/if}
  <div class="ilw-modal-body">
    {#if body}{@render body()}{:else if message}<p id={messageId}>{message}</p>{/if}
  </div>
  <form method="dialog" class="ilw-modal-buttons" bind:this={row}>
    {#each buttons as button, i (i)}
      <button class="ilw-button" value={String(i)}>{button.label}</button>
    {/each}
  </form>
  <button type="button" class="ilw-modal-close" aria-label="Close" onclick={() => dialog.close()}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.26 51.26" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="m37.84 32.94-7.63-7.63 7.63-7.63a3.24 3.24 0 0 0-4.58-4.58l-7.63 7.63L18 13.1a3.24 3.24 0 0 0-4.58 4.58L21 25.31l-7.62 7.63A3.24 3.24 0 1 0 18 37.52l7.63-7.63 7.63 7.63a3.24 3.24 0 0 0 4.58-4.58Z"
      />
    </svg>
  </button>
</dialog>
