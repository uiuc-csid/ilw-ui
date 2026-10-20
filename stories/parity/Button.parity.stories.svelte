<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import ButtonGrid, { BUTTON_THEMES, BUTTON_VARIANTS } from './ButtonGrid.svelte';
  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({
    title: 'Parity/Button',
    component: ButtonGrid,
    args: { variant: 'all' },
    argTypes: { variant: { control: 'select', options: BUTTON_VARIANTS } },
  });
</script>

<!--
  Every button theme × size, both disabled forms and the `ul.ilw-buttons` lists, styled by the vendored `toolkit.css` only.

  **Why:** the reference for `button.css`. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** the toolkit's buttons. Its disabled link looks enabled: the toolkit has no disabled-link rule.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }} />

<!--
  The same markup, styled by ilw-ui's `styles.css` only.

  **Why:** `button.css` claims the toolkit's button classes; this is where they're compared by eye (and by Chromatic against its baseline).

  **Review:** every row matches **Toolkit** in size, colour, border and type, except the disabled link, which looks like the disabled button. Switch the toolbar to Dark: the outline buttons and the disabled surface turn dark; the filled ones keep their colours.
-->
<Story name="IlwUi" parameters={{ styles: 'ilw-ui' }} />

<!--
  Both sides, one row per theme, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** each row's two frames look the same; hover and Tab through both to compare the states (the toolkit shows focus on `:focus`, ilw-ui on `:focus-visible`, with a ring).
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide
      pair="parity-button"
      theme={String(context.globals.theme ?? 'light')}
      height={150}
      rows={[
        ...BUTTON_THEMES.map((t) => ({ label: t === 'none' ? 'No theme' : `.ilw-theme-${t}`, args: { variant: t } })),
        { label: 'ul.ilw-buttons, ul.ilw-buttons-left', args: { variant: 'lists' } },
      ]}
    />
  {/snippet}
</Story>
