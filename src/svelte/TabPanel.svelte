<!--
  One tab (C3) of a `Tabs`: a headed section, which is what a server render
  (or a page without script) shows. Its `label` is both the heading and the
  tab's text. Once its `Tabs` mounts, the tab list turns the section into a
  tabpanel. Styled by tabs.css.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  import { getTabsContext } from './tabs-context.ts';

  let {
    id,
    label,
    children,
  }: {
    /** The panel's id: the fragment that links to it, and the tab's id with `-tab`. */
    id: string;
    /** The tab's text, and the panel's heading. */
    label: string;
    /** The panel's content, after its heading. */
    children: Snippet;
  } = $props();

  const tabs = getTabsContext();
  let el = $state<HTMLElement>();

  $effect(() => {
    if (!el || !tabs) return;
    const section = el;
    return tabs.add({
      get id() {
        return id;
      },
      get label() {
        return label;
      },
      el: section,
    });
  });
</script>

<section bind:this={el} class="ilw-tabs-panel" {id}>
  <svelte:element this={`h${tabs?.level ?? 3}`} class="ilw-tabs-heading">{label}</svelte:element>
  {@render children()}
</section>
