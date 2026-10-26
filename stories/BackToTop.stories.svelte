<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';

  import Footer from '../src/svelte/Footer.svelte';
  import Page from '../src/svelte/Page.svelte';

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
  play={async ({ canvas, canvasElement }) => {
    const shell = canvasElement.querySelector('.ilw-page')!;
    const link = canvas.getByRole('link', { name: 'Back to top' });
    await expect(link).toHaveClass('ilw-back-to-top');
    await expect(shell.lastElementChild).toBe(link);
    await expect(link).toHaveAttribute('href', `#${shell.id}`);
    // Focusable by script only, so following the link moves focus there.
    await expect(shell).toHaveAttribute('tabindex', '-1');
    await expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    const style = getComputedStyle(link);
    await expect(style.position).toBe('fixed');
    await expect(style.display).not.toBe('none');
    await expect(style.visibility).toBe('visible');

    // Hidden at the top of the page is the keyboard spec's check: the test runner's frame doesn't
    // drive the scroll timeline at scroll position 0. Fully shown once scrolled to the end, everywhere.
    const scroller = document.scrollingElement!;
    scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'instant' });
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await expect(Number(getComputedStyle(link).opacity)).toBe(1);
    scroller.scrollTo({ top: 0, behavior: 'instant' });
  }}
/>
