<!--
  The section nav (B6), rendering the markup documented in the README: a
  labelled nav holding nested lists of links, where each branch is a link plus
  a separate <details> toggle for its subpages. No script: the server-rendered
  `open` attributes put the current page's branch open, and the browser does
  the rest. Styled by section-nav.css.
-->
<script module lang="ts">
  export interface SectionNavItem {
    label: string;
    href: string;
    /** This is the page being shown: `aria-current="page"`, and its ancestors start open. */
    current?: boolean;
    children?: SectionNavItem[];
  }

  /** Whether `item` or one of its descendants is the current page. */
  function holdsCurrent(item: SectionNavItem): boolean {
    return !!item.current || (item.children ?? []).some(holdsCurrent);
  }
</script>

<script lang="ts">
  let {
    items,
    label = 'Pages In This Section',
    root = true,
    open = false,
    expanded = false,
    id,
    class: className = '',
  }: {
    /** The section's pages, as a tree. */
    items: SectionNavItem[];
    /** The nav's name, and the text of the toggle at narrow widths. */
    label?: string;
    /** Styles the first item as the section's own page (`ilw-section-nav--root`), as upstream. */
    root?: boolean;
    /** Starts the narrow-width "Pages In This Section" toggle open. Wider than 700 px the list always shows. */
    open?: boolean;
    /** Starts every branch open (upstream's look, which has no branch toggles), not only the current one's. */
    expanded?: boolean;
    /** Prefix for the label's id; defaults to a generated one. */
    id?: string;
    /** More classes on the nav. */
    class?: string;
  } = $props();

  const uid = $props.id();
  const labelId = $derived(`${id ?? uid}-label`);
</script>

{#snippet chevron()}
  <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.4 23.82">
    <path
      fill="currentColor"
      d="m39.34,1.06c-1.41-1.41-3.7-1.41-5.12,0l-14.02,14.02L6.18,1.06C4.76-.35,2.47-.35,1.06,1.06s-1.41,3.7,0,5.12l16.58,16.58c1.41,1.41,3.7,1.41,5.12,0L39.34,6.18c1.41-1.41,1.41-3.7,0-5.12Z"
    />
  </svg>
{/snippet}

{#snippet list(level: SectionNavItem[], top: boolean)}
  <ul>
    {#each level as item, i (i)}
      {@const link = {
        href: item.href,
        class: top && root && i === 0 ? 'ilw-section-nav--root' : undefined,
        'aria-current': item.current ? ('page' as const) : undefined,
      }}
      {#if item.children?.length}
        <li class="ilw-section-nav-branch">
          <a {...link}>{item.label}</a>
          <details open={expanded || holdsCurrent(item)}>
            <summary><span class="ilw-visually-hidden">Subpages of {item.label}</span>{@render chevron()}</summary>
            {@render list(item.children, false)}
          </details>
        </li>
      {:else}
        <li><a {...link}>{item.label}</a></li>
      {/if}
    {/each}
  </ul>
{/snippet}

<nav class={['ilw-section-nav', className]} aria-labelledby={labelId}>
  <details class="ilw-section-nav-collapse" {open}>
    <summary id={labelId}>{label}{@render chevron()}</summary>
    {@render list(items, true)}
  </details>
</nav>
