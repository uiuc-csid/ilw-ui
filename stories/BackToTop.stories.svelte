<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Footer from '../src/svelte/Footer.svelte';
  import Page from '../src/svelte/Page.svelte';
  import * as plays from './plays/back-to-top.ts';

  // Back to top (B7) on a long page; each story renders its own shell, since the link targets it.
  const { Story } = defineMeta({
    title: 'Page Chrome/Back to top',
    parameters: { styles: 'ilw-ui', shell: false, layout: 'fullscreen' },
  });

  const sections = Array.from({ length: 12 }, (_, i) => i + 1);
</script>

{#snippet page()}
  <Page format margin backToTop>
    {#snippet header()}
      <header><p style:margin="0" style:padding="1rem">Site header</p></header>
    {/snippet}
    <h1>A long page</h1>
    {#each sections as n (n)}
      <h2>Section {n}</h2>
      <p>
        Enough text to make the page several screens tall, so the back-to-top link has somewhere to go back to. It fades in
        over the first screen of scrolling.
      </p>
      <p>A second paragraph, so each section takes some room on a wide screen as well as a narrow one.</p>
    {/each}
    <p><a href="#last-link">The last link in main</a></p>
    {#snippet footer()}
      <Footer>
        {#snippet siteName()}<a href="#home">Sample Site</a>{/snippet}
      </Footer>
    {/snippet}
  </Page>
{/snippet}

<!--
  A long page with `Page`'s `backToTop`. No play function: the keyboard spec (`tests/e2e/page-chrome.spec.ts`) drives this one from a fresh load.

  **Why:** the fixture for the back-to-top checks: hidden at the top, shown when focused or scrolled, and following it puts the next Tab on the skip link.

  **Review:** scroll down: the round arrow fades in at the bottom right. Click it: the page scrolls to the top. Press Tab after following it with Enter: "Skip to main content" appears.
-->
<Story name="Fixture" template={page} />

<!--
  The same page; the play function checks the contract and the reveal.

  **Why:** the link is the shell's last child, points at its `id`, is named by hidden text, and is never hidden from assistive technology. It is fully shown once scrolled a screen.

  **Review:** as **Fixture**.
-->
<Story
  name="Long page"
  template={page}
  play={plays.longPage}
/>
