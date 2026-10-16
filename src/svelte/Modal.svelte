<script lang="ts" generics="T">
  import { onMount, type Snippet } from 'svelte';
  import { on } from 'svelte/events';

  import type { CloseReason, ModalButton } from './modal.ts';

  let {
    id,
    title = '',
    size = 'small',
    body,
    message = '',
    buttons,
    onclose,
  }: {
    id: string;
    title?: string;
    size?: string;
    /** Rich content; takes precedence over `message`. */
    body?: Snippet;
    /** Plain text, rendered as a `<p>`. */
    message?: string;
    buttons: ModalButton<T>[];
    /** Called once, when the modal closes: the clicked button's value, or null when dismissed. */
    onclose: (reason: CloseReason, value: T | null) => void;
  } = $props();

  type IlwModal = HTMLElement & { open: boolean; updateComplete: Promise<boolean> };
  let modal: IlwModal;
  let row: HTMLElement;
  let clicked: ModalButton<T> | null = null;

  onMount(() => {
    // Set as attributes: Svelte would assign properties on the upgraded
    // element, and ilw-modal reflects neither (its `id` even shadows the
    // native, reflecting one), so selectors like `ilw-modal#id` would miss.
    modal.setAttribute('id', id);
    modal.setAttribute('size', size);
    // ilw-modal fires no close event (Escape, × and the backdrop just clear
    // `open`), so watch the reflected attribute.
    const observer = new MutationObserver(() => {
      if (modal.hasAttribute('open')) return;
      observer.disconnect();
      onclose(clicked ? 'button' : 'dismiss', clicked ? clicked.value : null);
    });
    observer.observe(modal, { attributes: true, attributeFilter: ['open'] });
    modal.open = true;
    // ilw-modal honours `autofocus` only on its direct slotted children, not
    // on buttons nested in .modal-buttons, so focus it once rendered.
    modal.updateComplete.then(() => row.querySelector<HTMLElement>('[autofocus]')?.focus());
    return () => observer.disconnect();
  });

  // Not `onclick`: Svelte delegates that to the mount root, and ilw-modal's
  // dialog stops click propagation, so the handler would never run.
  function chooses(button: ModalButton<T>) {
    return (el: HTMLElement) =>
      on(el, 'click', () => {
        clicked = button;
        modal.open = false;
      });
  }
</script>

<ilw-modal bind:this={modal}>
  {#if title}<h2 slot="title">{title}</h2>{/if}
  {#if body}{@render body()}{:else if message}<p>{message}</p>{/if}
  <div class="modal-buttons" bind:this={row}>
    {#each buttons as button, i (i)}
      <!-- svelte-ignore a11y_autofocus -- autofocus marks the safe choice in a dialog, where moving focus is expected -->
      <button type="button" class="ilw-button" autofocus={button.autofocus} {@attach chooses(button)}
        >{button.label}</button
      >
    {/each}
  </div>
</ilw-modal>
