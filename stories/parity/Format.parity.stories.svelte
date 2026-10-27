<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import FormatSample from './FormatSample.svelte';
  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/Format', component: FormatSample });
</script>

<!--
  A long sample page inside the toolkit's `<ilw-page class="ilw-format"><main>`, styled by the vendored `toolkit.css` only.

  **Why:** the reference for `format.css`. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** compare with **IlwUi** or **Side By Side**. Known differences: the toolkit draws the new-window icon only inside `<ilw-content>`, so this side has none; links here have no visited colour or focus outline; `hr` and `pre` are the browser's.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }} />

<!--
  The same markup, styled by ilw-ui's `styles.css` only, through `.ilw-format` on the sample's own `<div>`.

  **Why:** `format.css` claims the toolkit's prose sizes, margins and colours; this is where they're compared by eye (and by Chromatic against its baseline). The **Format** stories check the values.

  **Review:** headings, paragraphs and lists line up with **Toolkit** (same sizes, same spacing). The Graduate College link ends in the link icon. Tab to a link: it gets the light-blue focus background and an outline.
-->
<Story name="IlwUi" tags={['framework-neutral']} parameters={{ styles: 'ilw-ui' }} />

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the two frames scroll separately; text should wrap at the same words. Switch the toolbar theme to Dark to see ilw-ui's dark prose next to the (light-only) toolkit.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-format" theme={String(context.globals.theme ?? 'light')} height={900} />
  {/snippet}
</Story>
