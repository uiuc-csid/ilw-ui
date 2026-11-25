<!--
  One tab (C3) of a `Tabs`: a headed section, which is what a server render
  (or a page without script) shows. Its `label` is both the heading and the
  tab's text. Once its `Tabs` mounts, the tab list turns the section into a
  tabpanel. Its content reads which panel it is in, and whether that
  panel shows, with `getTabPanel()`. Styled by tabs.css.
-->
<script lang="ts">
  import { onDestroy, type Snippet } from 'svelte';

  import { getTabsContext, setTabPanelContext } from './tabs-context.ts';

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
  setTabPanelContext({
    get id() {
      return id;
    },
    get label() {
      return label;
    },
    get active() {
      const current = tabs?.current;
      return current === undefined || current === id;
    },
  });
  let el = $state<HTMLElement>();

  // Registered as it initialises, not from an effect: its Tabs then knows the
  // current panel before any content's effect reads `active`.
  if (tabs) {
    onDestroy(
      tabs.add({
        get id() {
          return id;
        },
        get label() {
          return label;
        },
        get el() {
          return el;
        },
      }),
    );
  }
</script>

<section bind:this={el} class="ilw-tabs-panel" {id}>
  <svelte:element this={`h${tabs?.level ?? 3}`} class="ilw-tabs-heading">{label}</svelte:element>
  {@render children()}
</section>
