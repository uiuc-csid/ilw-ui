<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Page from '../../src/svelte/Page.svelte';
  import * as plays from '../plays/page.ts';
  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets. Both sides are whole pages, so
  // neither gets the Storybook page wrapper.
  const { Story } = defineMeta({ title: 'Parity/Page', parameters: { shell: false } });
</script>

{#snippet content()}
  <h1>Douglas Adams</h1>
  <p>
    Douglas Adams was an English author, best known for <em>The Hitchhiker's Guide to the Galaxy</em>. Read more on
    <a href="#wikipedia">Wikipedia</a>.
  </p>
{/snippet}

<!--
  `<ilw-page>` with a header, main and footer, as in the toolkit's own sample, styled by `toolkit.css` only.

  **Why:** the reference for the shell's layout. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** the toolkit page has no skip link and doesn't set the page colours.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }}>
  <ilw-page class="ilw-format">
    <header slot="header"><p style:margin="0">Header</p></header>
    <main>{@render content()}</main>
    <footer slot="footer"><p style:margin="0">Footer</p></footer>
  </ilw-page>
</Story>

<!--
  The `Page` shell with the same content, styled by ilw-ui's `page.css` only.

  **Why:** proves the shell's contract: the skip link is the first focusable element, it targets `main`, and there is one each of the banner, main and content-info landmarks.

  **Review:** looks like **Toolkit**, with the theme's link colours. Press Tab once: "Skip to main content" appears at the top left; Enter moves focus into the content (the next Tab reaches the Wikipedia link).
-->
<Story
  name="IlwUi"
  parameters={{ styles: 'ilw-ui' }}
  play={plays.parity}
>
  <Page format>
    {#snippet header()}<header><p style:margin="0">Header</p></header>{/snippet}
    {@render content()}
    {#snippet footer()}<footer><p style:margin="0">Footer</p></footer>{/snippet}
  </Page>
</Story>

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same layout on both sides. Switch the toolbar theme to Dark: only the ilw-ui side changes.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', shell: true, a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-page" theme={String(context.globals.theme ?? 'light')} height={300} />
  {/snippet}
</Story>
