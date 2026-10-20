<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/Button' });
</script>

{#snippet button()}
  <a class="ilw-button" href="#apply">Apply now</a>
{/snippet}

<!--
  A plain `<a class="ilw-button">`, styled by the vendored `toolkit.css` only.

  **Why:** the harness's sample pair, and the reference for the button styles (A3). Its axe check is off: this documents upstream, it isn't our code.

  **Review:** the toolkit's outline button.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }} template={button} />

<!--
  The same markup, styled by ilw-ui's `styles.css` only.

  **Why:** proves the stylesheet switch: no toolkit rule reaches this story.

  **Review:** until the button styles land (A3) this is a plain link: that gap is what the pair shows.
-->
<Story name="IlwUi" parameters={{ styles: 'ilw-ui' }} template={button} />

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** left is the toolkit's button, right is ilw-ui's.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-button" theme={String(context.globals.theme ?? 'light')} height={120} />
  {/snippet}
</Story>
