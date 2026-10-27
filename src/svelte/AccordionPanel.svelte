<!--
  One accordion panel (C2), the CSS form of <ilw-accordion-panel>: a <details>
  whose summary holds a chevron and the panel's heading, then the body. Inside
  an Accordion it joins the accordion's exclusive group (`single`) and its
  Expand All / Collapse All; on its own it is a styled details. Styled by
  accordion.css.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  import { getAccordionContext } from './accordion.ts';

  let {
    heading,
    summary,
    level = 3,
    open = $bindable(false),
    id,
    children,
  }: {
    /** The heading's text. Use `summary` instead for rich content (a link-free inline snippet). */
    heading?: string;
    /** The heading's content, in place of `heading`. No links or buttons: the whole summary is the button. */
    summary?: Snippet;
    /** The heading's level: one below the heading the accordion sits under. */
    level?: 2 | 3 | 4 | 5 | 6;
    /** Whether the panel is open; bindable. */
    open?: boolean;
    /** An id for the details, e.g. a fragment to link to. */
    id?: string;
    /** The panel's body. */
    children: Snippet;
  } = $props();

  const accordion = getAccordionContext();

  $effect(() =>
    accordion?.add((value) => {
      open = value;
    }),
  );
</script>

<details class="ilw-accordion-panel" {id} name={accordion?.name} bind:open>
  <summary>
    <svg class="ilw-accordion-icon" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.4 23.82">
      <path
        fill="currentColor"
        d="m39.34,1.06c-1.41-1.41-3.7-1.41-5.12,0l-14.02,14.02L6.18,1.06C4.76-.35,2.47-.35,1.06,1.06s-1.41,3.7,0,5.12l16.58,16.58c1.41,1.41,3.7,1.41,5.12,0L39.34,6.18c1.41-1.41,1.41-3.7,0-5.12Z"
      />
    </svg>
    <svelte:element this={`h${level}`} class="ilw-accordion-heading">
      {#if summary}{@render summary()}{:else}{heading}{/if}
    </svelte:element>
  </summary>
  <div class="ilw-accordion-body">
    {@render children()}
  </div>
</details>
