<!--
  The campus header (B2), rendering the markup documented in the README: the
  wordmark, the site's identity, and a menu (utility links, a GET search form,
  the main navigation and the dark-mode toggle's host) that is a popover under
  990 px and part of the header layout above. Menu sections are <details> in
  one exclusive group; with `megamenu`, top-level sections are popovers.
  Styled by header.css. The CSS form of <ilw-header>, <ilw-header-menu> and
  <ilw-header-megamenu>, with no script of its own.
-->
<script module lang="ts">
  export type HeaderLink = { label: string; href: string };

  /** A navigation item: a link, a section (`children` without `href`) or a linked section (both). */
  export type HeaderNavItem = {
    label: string;
    href?: string;
    /** The current page (`aria-current="page"` on its link), or the current section (`aria-current="true"` on its toggle). */
    current?: boolean;
    children?: HeaderNavItem[];
  };

  export type HeaderSearch = {
    /** Where the form submits (GET). */
    action: string;
    /** The query parameter's name. Default `q`. */
    name?: string;
    /** The submit button's text, which also labels the field. Default "Search". */
    label?: string;
  };
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  import DarkModeToggle from './DarkModeToggle.svelte';

  let {
    siteName,
    siteHref = '/',
    heading = false,
    parentUnit,
    source = 'Illinois_App',
    links = [],
    linksLabel = 'Utility',
    search = false,
    nav = [],
    navLabel = 'Main',
    megamenu = false,
    darkModeToggle = false,
    menuLabel = 'Menu',
    id = 'ilw-header',
    class: className = '',
  }: {
    /** The site's name: text, or a snippet for richer content. */
    siteName: string | Snippet;
    /** The site name's link; `null` renders it unlinked. */
    siteHref?: string | null;
    /** Render the site name as the page's `<h1>`. */
    heading?: boolean;
    /** The parent unit, shown above the site name. */
    parentUnit?: HeaderLink;
    /** The UTM source on the wordmark link (the toolkit's `source`). */
    source?: string;
    /** Utility links (the toolkit's `links` slot). */
    links?: HeaderLink[];
    /** The utility links' navigation name. */
    linksLabel?: string;
    /** A GET search form, or `false` for none. */
    search?: HeaderSearch | false;
    /** The main navigation tree. */
    nav?: HeaderNavItem[];
    /** The main navigation's name. */
    navLabel?: string;
    /** Top-level sections open as full-width popover panels (the toolkit's megamenu). */
    megamenu?: boolean;
    /** Render the dark-mode toggle in the menu. */
    darkModeToggle?: boolean;
    /** The narrow-screen menu button's text. */
    menuLabel?: string;
    /** Prefix for the ids and `details` names; set it when a page has two headers. */
    id?: string;
    /** More classes on the header. */
    class?: string;
  } = $props();

  const hasMenu = $derived(links.length > 0 || !!search || nav.length > 0 || darkModeToggle);
  const searchName = $derived(search ? (search.name ?? 'q') : 'q');
  const searchLabel = $derived(search ? (search.label ?? 'Search') : 'Search');
  const wordmarkHref = $derived(
    `https://illinois.edu/?utm_source=${encodeURIComponent(source)}&utm_medium=web&utm_campaign=Header`,
  );
</script>

{#snippet chevron()}
  <svg class="ilw-header-chevron" viewBox="0 0 40.4 23.82" aria-hidden="true" focusable="false">
    <path
      d="m39.34,1.06c-1.41-1.41-3.7-1.41-5.12,0l-14.02,14.02L6.18,1.06C4.76-.35,2.47-.35,1.06,1.06s-1.41,3.7,0,5.12l16.58,16.58c1.41,1.41,3.7,1.41,5.12,0L39.34,6.18c1.41-1.41,1.41-3.7,0-5.12Z"
    />
  </svg>
{/snippet}

{#snippet siteNameContent()}
  {#if typeof siteName === 'string'}{siteName}{:else}{@render siteName()}{/if}
{/snippet}

<!-- A section's list. `group` is the `details` name its own subsections share. -->
{#snippet list(items: HeaderNavItem[], group: string)}
  <ul>
    {#each items as item, i (item.label)}
      {#if item.children?.length}
        {@const sub = `${group}-${i + 1}`}
        {#if item.href}
          <li class="ilw-header-nav-linked">
            <a href={item.href} aria-current={item.current ? 'page' : undefined}>{item.label}</a>
            <details name={group}>
              <summary
                ><span class="ilw-visually-hidden">Subpages of {item.label}</span>{@render chevron()}</summary
              >
              {@render list(item.children, sub)}
            </details>
          </li>
        {:else}
          <li>
            <details name={group}>
              <summary aria-current={item.current ? 'true' : undefined}>{item.label}{@render chevron()}</summary>
              {@render list(item.children, sub)}
            </details>
          </li>
        {/if}
      {:else}
        <li><a href={item.href} aria-current={item.current ? 'page' : undefined}>{item.label}</a></li>
      {/if}
    {/each}
  </ul>
{/snippet}

<!-- A megamenu panel's columns: a link with its own links, or a flat list. -->
{#snippet panel(items: HeaderNavItem[])}
  <ul class={['ilw-header-megamenu-list', items.some((c) => c.children?.length) && 'ilw-header-megamenu-list--columns']}>
    {#each items as item (item.label)}
      <li>
        {#if item.href}
          <a href={item.href} aria-current={item.current ? 'page' : undefined}>{item.label}</a>
        {:else}
          <span class="ilw-header-megamenu-label">{item.label}</span>
        {/if}
        {#if item.children?.length}
          <ul>
            {#each item.children as child (child.label)}
              <li><a href={child.href} aria-current={child.current ? 'page' : undefined}>{child.label}</a></li>
            {/each}
          </ul>
        {/if}
      </li>
    {/each}
  </ul>
{/snippet}

<header class={['ilw-header', className]}>
  <div class="ilw-header-main">
    <a class="ilw-header-wordmark" href={wordmarkHref}>
      <span class="ilw-visually-hidden">University of Illinois Urbana-Champaign</span>
      <span class="ilw-header-block-i">
        <svg viewBox="0 0 24 34.67" aria-hidden="true" focusable="false">
          <path
            class="outline"
            d="M24 9.33V0H0v9.33h5.33v16H0v9.33h24v-9.33h-5.33v-16H24zm-5.33 17.34h4v6.67H1.33v-6.67h4c.74 0 1.33-.6 1.33-1.33v-16C6.67 8.6 6.07 8 5.33 8h-4V1.33h21.33V8h-4c-.74 0-1.33.6-1.33 1.33v16c0 .74.6 1.34 1.34 1.34z"
          />
          <path
            class="fill"
            d="M18.67 8h4V1.33H1.33V8h4c.74 0 1.33.6 1.33 1.33v16c0 .74-.6 1.33-1.33 1.33h-4v6.67h21.33v-6.67h-4c-.74 0-1.33-.6-1.33-1.33v-16c0-.73.6-1.33 1.34-1.33z"
          />
        </svg>
      </span>
      <svg class="ilw-header-wordmark-text" viewBox="0 0 378.6 10.1" aria-hidden="true" focusable="false">
        <path
          d="M376.4.2v5.9L371.5.2h-1.9V10h2.3V4l4.8 6h1.9V.2zM361.1 2.3c.5-.3 1-.4 1.7-.4 1 0 1.8.4 2.5 1.1l1.5-1.3c-.5-.6-1.1-1-1.8-1.3-.7-.3-1.5-.4-2.3-.4-1 0-2 .2-2.8.7-.8.4-1.5 1-1.9 1.8-.5.8-.7 1.6-.7 2.6s.2 1.8.7 2.6c.5.8 1.1 1.4 1.9 1.8.8.4 1.7.6 2.7.6.7 0 1.4-.1 2.1-.3.7-.2 1.3-.5 1.8-.9v-4h-2.1v2.9c-.5.3-1.1.4-1.8.4-.6 0-1.2-.1-1.7-.4-.5-.3-.8-.6-1.1-1.1-.3-.5-.4-1-.4-1.6 0-.6.1-1.2.4-1.6.5-.5.8-.9 1.3-1.2zM352.4.2h2.3V10h-2.3zM343.8.2l-4.4 9.8h2.3l.9-2.1h4.5l.9 2.1h2.4L346 .2h-2.2zm-.4 5.9 1.6-3.8 1.6 3.8h-3.2zM336.7.6c-.6-.3-1.4-.4-2.3-.4h-4.2V10h2.3V7.3h2c.9 0 1.6-.1 2.3-.4.6-.3 1.1-.7 1.5-1.2.3-.5.5-1.2.5-1.9s-.2-1.4-.5-1.9c-.4-.6-.9-1-1.6-1.3zm-.8 4.4c-.4.3-.9.4-1.6.4h-1.8V2h1.8c.7 0 1.2.1 1.6.4.4.3.5.7.5 1.3 0 .6-.1 1-.5 1.3zM325.1.2l-3.6 6.1-3.7-6.1H316V10h2.1V4.2l2.8 4.7h1.1l2.9-4.8V10h2.1V.2zM307.4.2 303 10h2.3l.9-2.1h4.6l.9 2.1h2.4L309.7.2h-2.3zm-.4 5.9 1.6-3.8 1.6 3.8H307zM298.8 4h-4.4V.2h-2.3V10h2.3V6h4.4v4h2.3V.2h-2.3zM284.1 2.3c.5-.3 1-.4 1.6-.4 1 0 1.8.4 2.5 1.1l1.5-1.3c-.5-.6-1-1-1.7-1.3-.7-.3-1.4-.4-2.3-.4-1 0-1.9.2-2.7.7-.8.4-1.4 1-1.9 1.8s-.7 1.6-.7 2.6.2 1.8.7 2.6c.5.8 1.1 1.4 1.9 1.8.8.4 1.7.6 2.7.6.8 0 1.6-.1 2.3-.4.7-.3 1.3-.7 1.7-1.3L288.2 7c-.7.8-1.5 1.2-2.5 1.2-.6 0-1.1-.1-1.6-.4-.5-.3-.9-.6-1.1-1.1-.3-.5-.4-1-.4-1.6 0-.6.1-1.1.4-1.6.3-.5.6-.9 1.1-1.2zM274.1 5.2h4V7h-4zM266.3.2 262 10h2.3l.9-2.1h4.6l.9 2.1h2.4L268.7.2h-2.4zm-.4 5.9 1.6-3.8 1.6 3.8h-3.2zM257.8 6.1 252.9.2H251V10h2.3V4l4.9 6h1.8V.2h-2.2zM242.5.2l-4.4 9.8h2.3l.9-2.1h4.5l.9 2.1h2.4L244.7.2h-2.2zm-.5 5.9 1.6-3.8 1.6 3.8H242zM235 4.9c.4-.2.7-.5 1-.9.2-.4.4-.8.4-1.3 0-.8-.3-1.4-1-1.9-.6-.5-1.5-.7-2.7-.7h-4.8V10h5.1c1.3 0 2.2-.2 2.9-.7.7-.5 1-1.1 1-2 0-.6-.2-1.1-.5-1.5-.4-.5-.8-.8-1.4-.9zm-4.9-3h2.3c.6 0 1 .1 1.3.3.3.2.4.5.4.9s-.1.7-.4.9-.7.3-1.3.3h-2.3V1.9zM234 8c-.3.2-.7.3-1.3.3h-2.6V5.8h2.6c1.2 0 1.8.4 1.8 1.2 0 .5-.1.8-.5 1zM224.6 5.6c.4-.5.5-1.2.5-1.9s-.2-1.4-.5-1.9-.8-.9-1.5-1.2c-.6-.3-1.4-.4-2.3-.4h-4.2V10h2.3V7.2h2.1l1.9 2.7h2.4l-2.2-3.1c.6-.3 1.1-.7 1.5-1.2zm-2.3-.6c-.4.3-.9.4-1.6.4h-1.8V2h1.8c.7 0 1.2.1 1.6.4.4.3.5.7.5 1.3 0 .6-.2 1-.5 1.3zM211.2 5.6c0 .9-.2 1.6-.6 2-.4.4-.9.6-1.6.6-1.5 0-2.2-.9-2.2-2.6V.2h-2.3v5.5c0 1.4.4 2.5 1.2 3.3.8.8 1.9 1.2 3.3 1.2s2.5-.4 3.3-1.2c.8-.8 1.2-1.9 1.2-3.3V.2h-2.2v5.4zM195.6 4.7c-.5-.2-1.1-.4-1.8-.5-.7-.2-1.3-.3-1.6-.5-.3-.2-.5-.4-.5-.8s.1-.6.4-.8c.3-.2.8-.3 1.4-.3.9 0 1.8.3 2.7.8l.7-1.7c-.4-.3-1-.5-1.6-.6-.6-.1-1.2-.2-1.8-.2-.9 0-1.7.1-2.3.4-.6.3-1.1.6-1.4 1.1-.3.5-.5 1-.5 1.5 0 .7.2 1.2.5 1.6.3.4.8.7 1.2.9.5.2 1.1.4 1.8.5.5.1.9.2 1.1.3.3.1.5.2.7.4.2.1.3.3.3.6s-.2.6-.5.8c-.3.2-.8.3-1.4.3-.6 0-1.2-.1-1.7-.3s-1.1-.4-1.5-.7l-.6 1.5c.4.3 1 .6 1.7.8.7.2 1.5.3 2.3.3.9 0 1.7-.1 2.3-.4s1.1-.6 1.4-1.1c.3-.5.5-1 .5-1.5 0-.7-.2-1.2-.5-1.6-.4-.3-.8-.6-1.3-.8zM184.4.2h2.3V10h-2.3zM179.2.7c-.8-.4-1.7-.7-2.7-.7-1 0-1.9.2-2.8.7-.8.4-1.5 1-1.9 1.8-.5.8-.7 1.6-.7 2.6s.2 1.8.7 2.6c.5.8 1.1 1.4 1.9 1.8.8.4 1.7.7 2.8.7 1 0 1.9-.2 2.7-.7.8-.4 1.5-1 1.9-1.8.5-.8.7-1.6.7-2.6s-.2-1.8-.7-2.6c-.4-.8-1.1-1.4-1.9-1.8zm-.1 6c-.3.5-.6.8-1.1 1.1-.5.3-1 .4-1.6.4-.6 0-1.1-.1-1.6-.4-.5-.3-.8-.6-1.1-1.1-.3-.5-.4-1-.4-1.6 0-.6.1-1.1.4-1.6.3-.5.6-.8 1.1-1.1.5-.3 1-.4 1.6-.4.6 0 1.1.1 1.6.4.5.3.8.6 1.1 1.1.3.5.4 1 .4 1.6 0 .6-.1 1.1-.4 1.6zM166.2 6.1 161.4.2h-1.9V10h2.2V4l4.9 6h1.9V.2h-2.3zM154 .2h2.3V10H154zM146.9.2h-2.3V10h7.2V8.1h-4.9zM137.5.2h-2.2V10h7.2V8.1h-5zM129.8.2h2.3V10h-2.3zM115 10h2.3V6.4h4.6V4.6h-4.6V2h5.2V.2H115zM109.8.7c-.8-.5-1.7-.7-2.7-.7-1 0-1.9.2-2.8.7-.8.4-1.5 1-1.9 1.8-.5.8-.7 1.6-.7 2.6s.2 1.8.7 2.6c.5.8 1.1 1.4 1.9 1.8.8.4 1.7.7 2.8.7 1 0 1.9-.2 2.7-.7.8-.4 1.5-1 1.9-1.8.5-.8.7-1.6.7-2.6s-.2-1.8-.7-2.6c-.4-.8-1.1-1.4-1.9-1.8zm-.1 6c-.3.5-.6.8-1.1 1.1-.5.3-1 .4-1.6.4s-1.1-.1-1.6-.4c-.5-.3-.8-.6-1.1-1.1-.3-.5-.4-1-.4-1.6 0-.6.1-1.1.4-1.6.3-.5.6-.8 1.1-1.1.5-.3 1-.4 1.6-.4s1.1.1 1.6.4c.5.3.8.6 1.1 1.1.3.5.4 1 .4 1.6 0 .6-.1 1.1-.4 1.6zM90.7 4.5 88.1.2h-2.4l3.8 6.3V10h2.3V6.5L95.6.2h-2.2zM76.6 2h3.1v8H82V2h3.1V.2h-8.5zM72.2.2h2.3V10h-2.3zM68 4.7c-.5-.2-1.1-.4-1.8-.5-.7-.2-1.3-.3-1.6-.5-.4-.2-.6-.4-.6-.8s.1-.6.4-.8c.3-.2.8-.3 1.4-.3.9 0 1.8.3 2.7.8l.7-1.7c-.4-.3-1-.5-1.6-.6-.5-.2-1.1-.3-1.7-.3-.9 0-1.7.1-2.3.4-.6.3-1.1.6-1.4 1.1-.3.5-.5 1-.5 1.5 0 .7.2 1.2.5 1.6.4.4.8.7 1.3.9.5.2 1.1.3 1.8.5.5.1.9.2 1.1.3.3.1.5.2.7.4.2.1.3.3.3.6s-.2.6-.5.8c-.3.2-.8.3-1.4.3-.6 0-1.2-.1-1.7-.3-.6-.2-1.1-.4-1.5-.7L61.6 9c.4.3 1 .6 1.7.8.7.2 1.5.3 2.3.3.9 0 1.7-.1 2.3-.4.6-.3 1.1-.6 1.4-1.1.3-.5.5-1 .5-1.5 0-.7-.2-1.2-.5-1.6-.4-.3-.8-.6-1.3-.8zM59.1 5.6c.4-.5.5-1.2.5-1.9s-.2-1.4-.5-1.9-.8-.9-1.5-1.2C57 .3 56.2.2 55.3.2h-4.2V10h2.3V7.2h2.1l1.9 2.7h2.4l-2.2-3.1c.7-.3 1.2-.7 1.5-1.2zM56.8 5c-.4.3-.9.4-1.6.4h-1.8V2h1.8c.7 0 1.2.1 1.6.4.4.3.5.7.5 1.3 0 .6-.1 1-.5 1.3zM43.1 5.9h4.5V4.1h-4.5V2h5.1V.2h-7.4V10h7.6V8.1h-5.3zM33.8 7.2l-2.9-7h-2.5l4.2 9.8h2.3L39.1.2h-2.2zM24.2.2h2.3V10h-2.3zM18.8 6.1 13.9.2H12V10h2.3V4l4.9 6H21V.2h-2.2zM6.6 5.6c0 .9-.2 1.6-.6 2-.3.4-.8.6-1.5.6-1.5 0-2.2-.9-2.2-2.6V.2H0v5.5C0 7.1.4 8.2 1.2 9c.8.8 1.9 1.2 3.3 1.2S7 9.8 7.8 9C8.6 8.2 9 7.1 9 5.7V.2H6.6v5.4z"
        />
      </svg>
    </a>
    <div class="ilw-header-identity">
      {#if parentUnit}
        <a class="ilw-header-parent-unit" href={parentUnit.href}>{parentUnit.label}</a>
      {/if}
      {#if heading}
        <h1 class="ilw-header-site-name">
          {#if siteHref != null}<a href={siteHref}>{@render siteNameContent()}</a>{:else}{@render siteNameContent()}{/if}
        </h1>
      {:else if siteHref != null}
        <a class="ilw-header-site-name" href={siteHref}>{@render siteNameContent()}</a>
      {:else}
        <div class="ilw-header-site-name">{@render siteNameContent()}</div>
      {/if}
    </div>
    {#if hasMenu}
      <button class="ilw-header-toggle" type="button" popovertarget="{id}-menu">
        <svg class="ilw-header-toggle-open" viewBox="0 0 51.26 51.26" aria-hidden="true" focusable="false">
          <path
            d="M11.6 16.52h28.06a3.24 3.24 0 1 0 0-6.48H11.6a3.24 3.24 0 0 0 0 6.48ZM39.66 22.07H11.6a3.24 3.24 0 0 0 0 6.48h28.06a3.24 3.24 0 1 0 0-6.48ZM39.66 34.1H11.6a3.24 3.24 0 0 0 0 6.48h28.06a3.24 3.24 0 1 0 0-6.48Z"
          />
        </svg>
        <svg class="ilw-header-toggle-close" viewBox="0 0 51.26 51.26" aria-hidden="true" focusable="false">
          <path
            d="m37.84 32.94-7.63-7.63 7.63-7.63a3.24 3.24 0 0 0-4.58-4.58l-7.63 7.63L18 13.1a3.24 3.24 0 0 0-4.58 4.58L21 25.31l-7.62 7.63A3.24 3.24 0 1 0 18 37.52l7.63-7.63 7.63 7.63a3.24 3.24 0 0 0 4.58-4.58Z"
          />
        </svg>
        <span class="ilw-header-toggle-label">{menuLabel}</span>
      </button>
    {/if}
  </div>
  {#if hasMenu}
    <!-- With a megamenu the menu is "manual": a popover restores focus on Escape only when no
         other auto popover is open, so the panels inside it must be the only auto ones. -->
    <div class="ilw-header-menu" id="{id}-menu" popover={megamenu ? 'manual' : ''}>
      {#if links.length}
        <nav class="ilw-header-links" aria-label={linksLabel}>
          <ul>
            {#each links as link (link.href)}<li><a href={link.href}>{link.label}</a></li>{/each}
          </ul>
        </nav>
      {/if}
      {#if search}
        <form class="ilw-header-search" role="search" method="get" action={search.action}>
          <input type="search" name={searchName} aria-labelledby="{id}-search-button" />
          <button type="submit" id="{id}-search-button">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M10 2a8 8 0 0 1 6.32 12.9l5.39 5.39-1.42 1.42-5.39-5.39A8 8 0 1 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z"
              />
            </svg>
            {searchLabel}
          </button>
        </form>
      {/if}
      {#if nav.length}
        <nav class={['ilw-header-nav', megamenu && 'ilw-header-nav--mega']} aria-label={navLabel}>
          {#if megamenu}
            <ul>
              {#each nav as item, i (item.label)}
                {#if item.children?.length}
                  {@const panelId = `${id}-mega-${i + 1}`}
                  <li class={item.href ? 'ilw-header-nav-linked' : undefined}>
                    {#if item.href}
                      <a href={item.href} aria-current={item.current ? 'page' : undefined}>{item.label}</a>
                      <button type="button" class="ilw-header-megamenu-toggle" popovertarget={panelId}
                        ><span class="ilw-visually-hidden">Subpages of {item.label}</span>{@render chevron()}</button
                      >
                    {:else}
                      <button
                        type="button"
                        class="ilw-header-megamenu-toggle"
                        popovertarget={panelId}
                        aria-current={item.current ? 'true' : undefined}>{item.label}{@render chevron()}</button
                      >
                    {/if}
                    <div class="ilw-header-megamenu-panel" id={panelId} popover>
                      {@render panel(item.children)}
                    </div>
                  </li>
                {:else}
                  <li><a href={item.href} aria-current={item.current ? 'page' : undefined}>{item.label}</a></li>
                {/if}
              {/each}
            </ul>
          {:else}
            {@render list(nav, `${id}-nav`)}
          {/if}
        </nav>
      {/if}
      {#if darkModeToggle}
        <!-- The island host, already mounted here: mountIslands skips it. -->
        <span class="ilw-header-dark-mode" data-ilw-island="dark-mode-toggle" data-ilw-mounted><DarkModeToggle /></span>
      {/if}
    </div>
  {/if}
</header>
