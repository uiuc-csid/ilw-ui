<!--
  Tabs (C3), rendering the markup documented in the README: a box of headed
  sections, which is what a server render (or a page without script) shows.
  Once mounted it adds TabList, which makes the sections APG tabs. Styled by
  tabs.css.
-->
<script module lang="ts">
  import type { Snippet } from 'svelte';

  export interface TabItem {
    /** The panel's id: the fragment that links to it, and the tab's id with `-tab`. */
    id: string;
    /** The tab's text, and the panel's heading. */
    label: string;
    /** The panel's content, after its heading. */
    content: Snippet;
  }
</script>

<script lang="ts">
  import { type LayoutTheme, type LayoutWidth, widthClass } from '../core/layout.ts';
  import TabList from './TabList.svelte';

  let {
    tabs,
    selected = $bindable(),
    automatic = false,
    hash = false,
    horizontal = false,
    level = 3,
    label,
    labelledby,
    theme,
    width,
    id,
    class: className = '',
    onchange,
  }: {
    tabs: TabItem[];
    /** The selected panel's id (bindable); the first tab when unset. */
    selected?: string;
    /** Select a tab when the arrow keys reach it (the toolkit's behaviour); by default Enter or Space selects. */
    automatic?: boolean;
    /** Write `#<panel id>` to the URL when a tab is chosen. A fragment naming a panel always selects it. */
    hash?: boolean;
    /** Tabs in a row over the panels; by default a column at the left. */
    horizontal?: boolean;
    /** The panels' heading level. */
    level?: 2 | 3 | 4 | 5 | 6;
    /** The tab list's name, when no visible heading names it. */
    label?: string;
    /** The id of the heading that names the tab list. */
    labelledby?: string;
    /** A theme: background, text and tab colours. */
    theme?: LayoutTheme;
    /** Breaks out of the page margins, or keeps to them. */
    width?: LayoutWidth;
    /** The box's id. */
    id?: string;
    /** More classes on the box. */
    class?: string;
    /** Called with the panel id when the selection changes. */
    onchange?: (id: string) => void;
  } = $props();

  // Set once mounted, so a server render sends only the headed sections.
  let host = $state<HTMLElement>();
  // `theme` isn't a typed HTML attribute; tokens.css selects on it ([theme=blue]).
  const themeAttr = $derived(theme ? { theme } : {});
  const refs = $derived(tabs.map((tab) => ({ id: tab.id, label: tab.label })));
</script>

<div
  bind:this={host}
  {id}
  class={['ilw-tabs', horizontal && 'ilw-tabs--horizontal', widthClass(width), className]}
  {...themeAttr}
>
  <div class="ilw-tabs-container">
    {#if host}
      <TabList {host} tabs={refs} bind:selected {automatic} {hash} {horizontal} {label} {labelledby} {onchange} />
    {/if}
    {#each tabs as tab (tab.id)}
      <section class="ilw-tabs-panel" id={tab.id}>
        <svelte:element this={`h${level}`} class="ilw-tabs-heading">{tab.label}</svelte:element>
        {@render tab.content()}
      </section>
    {/each}
  </div>
</div>
