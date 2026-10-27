<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';

  import FormSample from './FormSample.svelte';
  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/Field' });
</script>

<!--
  Upstream's `samples/variations.html` (trimmed) inside `<ilw-content>`, styled by the vendored toolkit only.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code (its radio titles don't name their groups, and its switch has no visible focus ring).

  **Review:** compare with **IlwUi** or **Side By Side**.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }}>
  <FormSample side="toolkit" />
</Story>

<!--
  The same sample in ilw-ui's markup, styled by `forms.css` and `switch.css` only.

  **Why:** the play function checks upstream's measurements (a 200 px field with 10 px padding, 18 px boxes, a 225 px compact label column) and that each radio group is named by its legend. axe checks the whole form.

  **Review:** matches **Toolkit**, except: radio titles are legends (same place and type), the switch is ilw-ui's (no "On"/"Off" text), the select's chevron is drawn in the link-hover colour, and the compact help text sits under the control.
-->
<Story
  name="IlwUi"
  tags={['framework-neutral']}
  parameters={{ styles: 'ilw-ui' }}
  play={async ({ canvas, canvasElement }) => {
    const [text] = canvas.getAllByRole('textbox', { name: 'Text Box' });
    await expect(getComputedStyle(text).width).toBe('200px');
    await expect(getComputedStyle(text).paddingTop).toBe('10px');
    await expect(canvas.getAllByRole('checkbox')[0].getBoundingClientRect().height).toBe(18);
    const compact = canvasElement.querySelector('.ilw-input-entry-compact')!;
    await expect(getComputedStyle(compact).gridTemplateColumns).toMatch(/^225px /);
    await expect(canvas.getAllByRole('group', { name: 'Radio Buttons Title' })).toHaveLength(2);
    await expect(canvas.getAllByRole('group', { name: 'Vertical Radio Buttons Title' })).toHaveLength(2);
    await expect(canvas.getByRole('switch', { name: 'Toggle Checkbox' })).toHaveClass('ilw-switch');
  }}
>
  <FormSample side="ilw-ui" />
</Story>

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same form on both sides, row for row.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-field" theme={String(context.globals.theme ?? 'light')} height={2000} />
  {/snippet}
</Story>
