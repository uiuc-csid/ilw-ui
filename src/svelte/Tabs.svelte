<!--
  Tabs (C3), rendering the markup documented in the README: a box of headed
  sections (its `TabPanel` children), which is what a server render (or a page
  without script) shows. Once mounted it adds TabList, which makes the
  sections APG tabs, in the order the panels appear. Styled by tabs.css.
-->
<script lang="ts">
  import { type Snippet, untrack } from 'svelte';

  import { currentTab } from '../core/tabs.ts';
  import { type LayoutTheme, type LayoutWidth, widthClass } from '../core/layout.ts';
  import TabList from './TabList.svelte';
  import { type TabEntry, setTabsContext } from './tabs-context.ts';

  let {
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
    children,
  }: {
    /** The panels: `TabPanel`s. */
    children: Snippet;
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

  // The panels, as they register (in the order they initialise); listed in
  // document order once every section is bound.
  let entries = $state.raw<TabEntry[]>([]);
  const refs = $derived(
    (entries.every((entry) => entry.el)
      ? entries.toSorted((a, b) => (a.el!.compareDocumentPosition(b.el!) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
      : entries
    ).map((entry) => ({ id: entry.id, label: entry.label })),
  );

  // True in the browser from the start: a pre-effect runs while the component
  // initialises, before its children's effects (it never runs on the server).
  let browser = $state(false);
  $effect.pre(() => {
    browser = true;
  });

  // The panel that shows, as TabList decides it (currentTab over the same tabs
  // and `selected`). Undefined in a server render, where every panel shows.
  const current = $derived(browser && refs.length ? currentTab(refs, selected) : undefined);

  setTabsContext({
    get level() {
      return level;
    },
    get current() {
      return current;
    },
    add(entry) {
      // Untracked: a panel registers while it initialises, inside this component's render.
      entries = [...untrack(() => entries), entry];
      return () => {
        entries = untrack(() => entries).filter((e) => e !== entry);
      };
    },
  });
</script>

<div
  bind:this={host}
  {id}
  class={['ilw-tabs', horizontal && 'ilw-tabs--horizontal', widthClass(width), className]}
  {...themeAttr}
>
  <div class="ilw-tabs-container">
    <!-- Once the panels have registered, so the tab list starts with all of them (and a URL fragment can select one). -->
    {#if host && refs.length}
      <TabList {host} tabs={refs} bind:selected {automatic} {hash} {horizontal} {label} {labelledby} {onchange} />
    {/if}
    {@render children()}
  </div>
</div>
