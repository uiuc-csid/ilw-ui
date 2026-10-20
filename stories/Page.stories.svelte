<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';

  import Breadcrumbs from '../src/svelte/Breadcrumbs.svelte';
  import Footer from '../src/svelte/Footer.svelte';
  import Page from '../src/svelte/Page.svelte';
  import PageTitle from '../src/svelte/PageTitle.svelte';

  // A whole page from the static chrome (B1, B3, B4, B5), ilw-ui's styles only.
  const { Story } = defineMeta({
    title: 'Page Chrome/Page',
    parameters: { styles: 'ilw-ui', shell: false, layout: 'fullscreen' },
  });
</script>

{#snippet page()}
  <Page format>
    {#snippet header()}
      <header><p style:margin="0" style:padding="1rem">Site header (B2 comes later)</p></header>
    {/snippet}
    <Breadcrumbs items={[{ label: 'Home', href: '#home' }, { label: 'Academics', href: '#academics' }]} current="Degree programs" />
    <PageTitle>Degree programs</PageTitle>
    <p>The page content, with <a href="#a-link">a link</a> to tab to after the skip link moves focus here.</p>
    {#snippet footer()}
      <Footer>
        {#snippet siteName()}<a href="#home">Sample Site</a>{/snippet}
      </Footer>
    {/snippet}
  </Page>
{/snippet}

<!--
  A whole page: skip link, header, breadcrumbs, page title, content and footer. No play function: the keyboard spec (`tests/e2e/page-chrome.spec.ts`) drives this one from a fresh load.

  **Why:** the fixture for the skip link and landmark checks, and a view of the static chrome together. axe scans it as a page.

  **Review:** press Tab: "Skip to main content" appears; Enter, then Tab again, reaches the breadcrumbs' first link.
-->
<Story name="Fixture" template={page} />

<!--
  The same page with `html[data-theme="dark"]`.

  **Why:** the shell takes its colours from the theme, so the page turns dark; breadcrumbs follow; the page title and footer keep their brand plates, as upstream. axe checks the dark contrast.

  **Review:** a dark page with light text and light-blue links; the page title is light on dark; the footer bands are unchanged.
-->
<Story
  name="Dark"
  globals={{ theme: 'dark' }}
  template={page}
  play={async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('.ilw-page')!;
    await expect(getComputedStyle(shell).backgroundColor).toBe('rgb(17, 24, 29)');
    await expect(getComputedStyle(shell).color).toBe('rgb(244, 244, 244)');
    await expect(getComputedStyle(canvasElement.querySelector('.ilw-footer-campus')!).backgroundColor).toBe('rgb(19, 41, 75)');
  }}
/>
