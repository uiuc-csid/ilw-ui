<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import SideBySide from './SideBySide.svelte';
  import ThemeGrid from './ThemeGrid.svelte';
  import { THEMES, VARIANTS } from './themes.ts';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({
    title: 'Parity/Themes',
    component: ThemeGrid,
    args: { variant: 'all' },
    argTypes: { variant: { control: 'select', options: VARIANTS } },
  });
</script>

<!--
  The toolkit's theme classes and `[theme]` attributes, styled by the vendored `toolkit.css` only.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** compare with **IlwUi** or **Side By Side**. The toolkit has no dark-mode rules, so this side stays light under the Dark toolbar setting.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }} />

<!--
  The same theme grid, styled by ilw-ui's `styles.css` only.

  **Why:** `tokens.css` claims the toolkit's theme names and values; this is where they're compared by eye (and by Chromatic against its baseline). `tests/unit/tokens.test.ts` checks the values themselves.

  **Review:** every swatch matches **Toolkit**: background, text, heading, link and control colours. The two gradients use the same stops.
-->
<Story name="IlwUi" tags={['framework-neutral']} parameters={{ styles: 'ilw-ui' }} />

<!--
  Both sides, one row per theme, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** each row's two frames look the same. Switch the toolbar theme to Dark to see ilw-ui's dark values next to the (light-only) toolkit.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide
      pair="parity-themes"
      theme={String(context.globals.theme ?? 'light')}
      height={210}
      rows={THEMES.map((t) => ({ label: t.label, args: { variant: t.id } }))}
    />
  {/snippet}
</Story>
