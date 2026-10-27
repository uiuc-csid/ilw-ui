<!--
  Accordion (C2), rendering the markup documented in the README: a wrapper
  around AccordionPanels, the CSS form of <ilw-accordion>. Each panel is a
  <details>, so the accordion works without script; `single` gives them one
  shared `name` (the browser's exclusive accordion). The only scripted part is
  the optional Expand All / Collapse All pair, which sets every registered
  panel's `open`. Styled by accordion.css.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  import { type AccordionAccent, setAccordionContext } from './accordion.ts';

  let {
    accent = 'blue',
    compact = false,
    single = false,
    buttons = false,
    label,
    name,
    class: className = '',
    children,
  }: {
    /** The line at each panel's left (ignored when `compact`). */
    accent?: AccordionAccent;
    /** The smaller look: white panels between thin rules, no accent line, text-link buttons. */
    compact?: boolean;
    /** Opening a panel closes the others (the toolkit's `limit`). Works without script. */
    single?: boolean;
    /** Shows Expand All / Collapse All above the panels. Not with `single`: an exclusive group can't all be open. */
    buttons?: boolean;
    /** What the accordion is about, e.g. its heading's text; added (visually hidden) to the buttons' names. */
    label?: string;
    /** The shared `name` of the panels' details when `single`; defaults to a generated one. */
    name?: string;
    /** More classes on the wrapper, e.g. `ilw-width-full`. */
    class?: string;
    /** `AccordionPanel`s, and any headings that divide them into groups. */
    children: Snippet;
  } = $props();

  const uid = $props.id();
  const setters = new Set<(open: boolean) => void>();

  setAccordionContext({
    get name() {
      return single ? (name ?? `${uid}-accordion`) : undefined;
    },
    add(setOpen) {
      setters.add(setOpen);
      return () => setters.delete(setOpen);
    },
  });

  function setAll(open: boolean) {
    for (const setOpen of setters) setOpen(open);
  }
</script>

<div
  class={[
    'ilw-accordion',
    compact && 'ilw-accordion-compact',
    !compact && accent !== 'blue' && `ilw-accordion-accent-${accent}`,
    className,
  ]}
>
  {#if buttons && !single}
    <ul class={['ilw-accordion-buttons', !compact && 'ilw-buttons-left']}>
      <li>
        <button type="button" class={{ 'ilw-button': !compact }} onclick={() => setAll(true)}
          >Expand All{#if label}<span class="ilw-visually-hidden">&#32;{label}</span>{/if}</button
        >
      </li>
      <li>
        <button type="button" class={{ 'ilw-button': !compact }} onclick={() => setAll(false)}
          >Collapse All{#if label}<span class="ilw-visually-hidden">&#32;{label}</span>{/if}</button
        >
      </li>
    </ul>
  {/if}
  {@render children()}
</div>
