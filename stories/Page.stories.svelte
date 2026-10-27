<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Breadcrumbs from '../src/svelte/Breadcrumbs.svelte';
  import Footer from '../src/svelte/Footer.svelte';
  import Page from '../src/svelte/Page.svelte';
  import PageTitle from '../src/svelte/PageTitle.svelte';
  import * as plays from './plays/page.ts';

  // A whole page from the static chrome (B1, B3, B4, B5), ilw-ui's styles only.
  const { Story } = defineMeta({
    title: 'Page Chrome/Page',
    parameters: { styles: 'ilw-ui', shell: false, layout: 'fullscreen' },
  });

  const sections = ['CS 124', 'CS 128', 'CS 173', 'CS 225', 'CS 233', 'CS 341', 'CS 374', 'CS 421'];
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

{#snippet shellOnly()}
  <Page format margin backToTop>
    {#snippet header()}
      <header><p style:margin="0" style:padding="1rem">Course Staffing (the app's own header)</p></header>
    {/snippet}
    <h1>Course staff</h1>
    <p>
      Teaching assistants for this term, by course. The app renders its own header and footer; ilw-ui supplies only the
      shell around them. See <a href="#staffing-policy">the staffing policy</a> for how assignments are made.
    </p>
    {#each sections as course (course)}
      <h2>{course}</h2>
      <p>
        Two teaching assistants and one grader, with office hours on Tuesday and Thursday afternoons. Assignments are
        final once the department confirms them.
      </p>
    {/each}
    {#snippet footer()}
      <footer><p style:margin="0" style:padding="1rem"><a href="#contact">Contact the department</a></p></footer>
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
  play={plays.dark}
/>

<!--
  The shell on its own, as an app that renders its own header and footer uses it: skip link, a plain `<header>`, `main`, a plain `<footer>`, and `backToTop`. No other ilw-ui component is on the page. No play function: the keyboard spec (`tests/e2e/page-chrome.spec.ts`) drives this one from a fresh load.

  **Why:** the fixture for the shell's whole keyboard path, `Page` and `BackToTop` alone: the skip link into `main`, through the content and the footer to back to top, and from there to the skip link again. axe scans it as a page.

  **Review:** press Tab: "Skip to main content" appears; Enter, then Tab, reaches "the staffing policy". Tab twice more to the round arrow at the bottom right; Enter scrolls to the top, and the next Tab shows the skip link again.
-->
<Story name="Shell only" template={shellOnly} />
