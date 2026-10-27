<!--
  A tooltip (C4), rendering the markup documented in the README: the trigger
  (the `children` snippet, which spreads `attrs` on its focusable element) and
  a `role="tooltip"` bubble that describes it. Shown while the trigger or the
  bubble is hovered or the trigger has focus; Escape hides it. The bubble is a
  manual popover placed by CSS anchor positioning, or by script where that
  isn't supported. Styled by tooltip.css.
-->
<script module lang="ts">
  /** What `Tooltip` hands its trigger: spread it on the button or link. */
  export interface TooltipAttrs {
    'aria-describedby': string;
  }

  /** Where the bubble sits, named like the toolkit's `arrow`: `top-*` is above the trigger. */
  export type TooltipArrow =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
    | 'left'
    | 'right';

  // The gap between trigger and bubble, and the bubble's least distance from the viewport's sides (upstream's values).
  const OFFSET = 12;
  const MARGIN = 8;
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  import { nextId } from '../core/index.ts';
  import type { LayoutTheme } from '../core/layout.ts';

  let {
    text,
    content,
    arrow = 'top-center',
    theme,
    open = $bindable(false),
    id = nextId('ilw-tooltip'),
    class: className = '',
    children,
  }: {
    /** The tooltip's text. */
    text?: string;
    /** Rich content instead of `text` (no focusable elements: a tooltip is never focused). */
    content?: Snippet;
    /** Where the bubble sits; the arrow points back at the trigger. */
    arrow?: TooltipArrow;
    /** The bubble's theme (the toolkit's `theme="blue"`). */
    theme?: LayoutTheme;
    /** Whether the bubble is shown. Hover, focus and Escape set it. */
    open?: boolean;
    /** The bubble's id; the trigger's `aria-describedby`. */
    id?: string;
    /** More classes on the outer element. */
    class?: string;
    /** The trigger. Spread `attrs` on it. */
    children: Snippet<[TooltipAttrs]>;
  } = $props();

  let host: HTMLElement;
  let bubble: HTMLElement;

  // Feature checks at mount, not module top level. Where the browser lacks popover the bubble
  // toggles `hidden`; where it lacks anchor positioning, place() positions it.
  const popover = typeof HTMLElement !== 'undefined' && 'showPopover' in HTMLElement.prototype;
  const anchored =
    typeof CSS !== 'undefined' && CSS.supports('position-area: top') && CSS.supports('anchor-scope: all');

  const attrs = $derived<TooltipAttrs>({ 'aria-describedby': id });
  // `theme` isn't a typed HTML attribute; tokens.css selects on it ([theme=blue]).
  const themeAttr = $derived(theme ? { theme } : {});

  let hovered = false;
  let focused = false;
  // Set by Escape, cleared by the next hover or focus: dismissed while still hovered or focused.
  let dismissed = false;

  function update() {
    open = (hovered || focused) && !dismissed;
  }

  function onfocusout(event: FocusEvent) {
    if (host.contains(event.relatedTarget as Node | null)) return;
    focused = false;
    update();
  }

  /** The script fallback: the same placement as tooltip.css's position-area, in viewport pixels. */
  function place() {
    // Measured at the viewport's corner, as upstream does: where it was last, less room could wrap it differently.
    bubble.style.top = bubble.style.left = '0px';
    const a = host.firstElementChild!.getBoundingClientRect();
    const b = bubble.getBoundingClientRect();
    const [side, align = 'center'] = arrow.split('-');
    let top: number;
    let left: number;
    if (side === 'left' || side === 'right') {
      top = a.top + (a.height - b.height) / 2;
      left = side === 'left' ? a.left - b.width - OFFSET : a.right + OFFSET;
    } else {
      top = side === 'top' ? a.top - b.height - OFFSET : a.bottom + OFFSET;
      left = align === 'left' ? a.left : align === 'right' ? a.right - b.width : a.left + (a.width - b.width) / 2;
      const max = document.documentElement.clientWidth - MARGIN - b.width;
      left = Math.max(MARGIN, Math.min(left, max));
    }
    bubble.style.top = `${top}px`;
    bubble.style.left = `${left}px`;
  }

  $effect(() => {
    if (!open) {
      if (popover && bubble.matches(':popover-open')) bubble.hidePopover();
      return;
    }
    if (popover && !bubble.matches(':popover-open')) bubble.showPopover();

    // Escape hides it wherever focus is (WCAG 1.4.13 dismissible), and is consumed so a
    // surrounding modal stays open. The next hover or focus shows it again.
    function onkeydown(event: KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      dismissed = true;
      update();
    }
    document.addEventListener('keydown', onkeydown);
    if (anchored) return () => document.removeEventListener('keydown', onkeydown);

    place();
    window.addEventListener('scroll', place, { capture: true, passive: true });
    window.addEventListener('resize', place, { passive: true });
    // Again when either box changes size, e.g. once a web font loads.
    const resized = new ResizeObserver(place);
    resized.observe(bubble);
    resized.observe(host);
    return () => {
      resized.disconnect();
      document.removeEventListener('keydown', onkeydown);
      window.removeEventListener('scroll', place, { capture: true });
      window.removeEventListener('resize', place);
    };
  });
</script>

<!-- The wrapper only watches hover and focus for the trigger inside it, which is the control; it needs no role. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
  bind:this={host}
  class={['ilw-tooltip', `ilw-tooltip--${arrow}`, { 'ilw-tooltip--anchored': anchored }, className]}
  onpointerenter={() => {
    hovered = true;
    dismissed = false;
    update();
  }}
  onpointerleave={() => {
    hovered = false;
    update();
  }}
  onfocusin={() => {
    focused = true;
    dismissed = false;
    update();
  }}
  {onfocusout}
>
  {@render children(attrs)}
  <span
    bind:this={bubble}
    class="ilw-tooltip-bubble"
    role="tooltip"
    {id}
    popover={popover ? 'manual' : undefined}
    hidden={popover ? undefined : !open}
    {...themeAttr}
  >
    {#if content}{@render content()}{:else}{text}{/if}
  </span>
</span>
