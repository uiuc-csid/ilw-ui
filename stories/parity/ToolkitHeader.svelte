<!--
  The toolkit side of the Header parity pair: <ilw-header> with
  <ilw-header-menu> (or <ilw-header-megamenu>) built from the same sample
  tree as the ilw-ui side, in the toolkit's own markup.
-->
<script lang="ts">
  import type { HeaderNavItem } from '../../src/svelte/Header.svelte';
  import { menu, megamenu, parentUnit, utilityLinks } from '../header-sample.ts';

  let { mega = false }: { mega?: boolean } = $props();
</script>

{#snippet menuItems(items: HeaderNavItem[])}
  <ul>
    {#each items as item (item.label)}
      <li>
        {#if item.children && item.href}
          <ilw-header-menu-section linked="true">
            <a slot="link" href={item.href}>{item.label}</a>
            {@render menuItems(item.children)}
          </ilw-header-menu-section>
        {:else if item.children}
          <ilw-header-menu-section>
            <span slot="label">{item.label}</span>
            {@render menuItems(item.children)}
          </ilw-header-menu-section>
        {:else}
          <a href={item.href} aria-current={item.current ? 'page' : undefined}>{item.label}</a>
        {/if}
      </li>
    {/each}
  </ul>
{/snippet}

<ilw-header source="ilw_ui">
  <a slot="primary-unit" href={parentUnit.href}>{parentUnit.label}</a>
  <a slot="site-name" href="#home">Component Builder</a>
  <nav slot="links" aria-label="Utility">
    <ul>
      {#each utilityLinks as link (link.href)}<li><a href={link.href}>{link.label}</a></li>{/each}
    </ul>
  </nav>
  <form slot="search" method="get" action="#search" role="search">
    <input type="search" name="q" aria-labelledby="tk-search-button" />
    <button id="tk-search-button" type="submit">Search</button>
  </form>
  {#if mega}
    <ilw-header-megamenu slot="navigation">
      <ul>
        {#each megamenu as item (item.label)}
          <li>
            {#if item.children}
              <ilw-header-megamenu-section class={item.children.some((c) => c.children) ? undefined : 'solo-list'}>
                <span slot="label">{item.label}</span>
                {#if item.children.some((c) => c.children)}
                  {#each item.children as column (column.label)}
                    <ul>
                      <li>
                        <a href={column.href}>{column.label}</a>
                        <ul>
                          {#each column.children ?? [] as link (link.label)}<li><a href={link.href}>{link.label}</a></li>{/each}
                        </ul>
                      </li>
                    </ul>
                  {/each}
                {:else}
                  <ul>
                    {#each item.children as link (link.label)}<li><a href={link.href}>{link.label}</a></li>{/each}
                  </ul>
                {/if}
              </ilw-header-megamenu-section>
            {:else}
              <a href={item.href}>{item.label}</a>
            {/if}
          </li>
        {/each}
      </ul>
    </ilw-header-megamenu>
  {:else}
    <ilw-header-menu slot="navigation">
      {@render menuItems(menu)}
    </ilw-header-menu>
  {/if}
</ilw-header>
