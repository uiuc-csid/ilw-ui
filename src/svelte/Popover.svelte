<!--
  A popover (E18), rendering the markup documented in the README: a button
  (`label`, or the `trigger` snippet, which spreads `attrs` on its button) that
  opens a non-modal panel (`children`) anchored to it. The panel is a native
  auto popover opened by the button's `popovertarget`, so Escape, a click
  outside and focus return come from the browser, and the markup works without
  script. The component adds the bindable `open`, closes the panel when focus
  leaves it, and places it by script where CSS anchor positioning isn't
  supported. Styled by popover.css.
-->
<script module lang="ts">
  /** What `Popover` hands a custom trigger: spread it on the button. */
  export interface PopoverAttrs {
    popovertarget: string;
  }

  export type { PopoverPlacement } from '../core/popover.ts';
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  import { nextId } from '../core/index.ts';
  import {
    anchorPositioning,
    closeOnFocusLeave,
    followPopover,
    type PopoverPlacement,
    syncPopover,
  } from '../core/popover.ts';

  let {
    label,
    trigger,
    placement = 'bottom-left',
    open = $bindable(false),
    id = nextId('ilw-popover'),
    class: className = '',
    children,
  }: {
    /** The default button's text (an `.ilw-button`). */
    label?: string;
    /** Any other button instead of `label`'s. Spread `attrs` on it, and make it the snippet's only element. */
    trigger?: Snippet<[PopoverAttrs]>;
    /** Where the panel sits against the button; it flips to the other side when there's no room. */
    placement?: PopoverPlacement;
    /** Whether the panel is shown. The button, Escape, a click outside and focus leaving set it. */
    open?: boolean;
    /** The panel's id; the button's `popovertarget`. */
    id?: string;
    /** More classes on the wrapper. */
    class?: string;
    /** The panel's content. */
    children: Snippet;
  } = $props();

  let host: HTMLElement;
  let panel: HTMLElement;

  const attrs = $derived<PopoverAttrs>({ popovertarget: id });

  $effect(() => {
    syncPopover(panel, open);
  });

  $effect(() => {
    if (!open || anchorPositioning()) return;
    return followPopover(host.firstElementChild!, panel, placement);
  });
</script>

<span
  bind:this={host}
  class={['ilw-popover', `ilw-popover--${placement}`, className]}
  onfocusout={(event) => closeOnFocusLeave(host, panel, event)}
>
  {#if trigger}
    {@render trigger(attrs)}
  {:else}
    <button type="button" class="ilw-button" {...attrs}>{label}</button>
  {/if}
  <div
    bind:this={panel}
    class="ilw-popover-panel"
    {id}
    popover=""
    ontoggle={(event) => (open = (event as ToggleEvent).newState === 'open')}
  >
    {@render children()}
  </div>
</span>
