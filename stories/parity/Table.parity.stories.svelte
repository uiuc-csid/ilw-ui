<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';

  import SideBySide from './SideBySide.svelte';
  import { TABLE_VARIANT_IDS, TABLE_VARIANTS } from './tables.ts';
  import TableSample from './TableSample.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({
    title: 'Parity/Table',
    component: TableSample,
    args: { variant: 'all' },
    argTypes: { variant: { control: 'select', options: TABLE_VARIANT_IDS } },
  });
</script>

<!--
  Every table variant (plain, inside `.ilw-format`, striped, row headers, responsive, the five `-table-*` themes), styled by the vendored `toolkit.css` only.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** compare with **IlwUi** or **Side By Side**. The toolkit has no dark-mode rules, so this side stays light under the Dark toolbar setting.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }} />

<!--
  The same tables, styled by ilw-ui's `table.css` only.

  **Why:** `table.css` claims the toolkit's table classes and themes. axe scans every variant here, in the light theme; the play function checks a few computed styles against the theme properties.

  **Review:** every table matches **Toolkit**: borders, head colours, stripes and fonts. Narrow the window below 600px: the outer border goes, and the responsive table scrolls sideways (tab to it and use the arrow keys) instead of stacking.
-->
<Story
  name="IlwUi"
  parameters={{ styles: 'ilw-ui' }}
  play={async ({ args, canvas, canvasElement }) => {
    // Side By Side loads this story once per variant; the checks need them all.
    if (args.variant !== 'all') return;
    const css = (el: Element, p: string) => getComputedStyle(el).getPropertyValue(p);
    const tables = canvasElement.querySelectorAll('table');
    await expect(tables).toHaveLength(TABLE_VARIANTS.length);
    // No stacking: every table part keeps its table display, so browsers keep the table semantics.
    for (const t of tables) {
      await expect(css(t, 'display')).toBe('table');
      for (const tr of t.querySelectorAll('tr')) await expect(css(tr, 'display')).toBe('table-row');
      for (const cell of t.querySelectorAll('th, td')) await expect(css(cell, 'display')).toBe('table-cell');
    }
    const region = canvas.getByRole('region', { name: '.ilw-table-responsive (scrolls sideways)' });
    await expect(region).toHaveAttribute('tabindex', '0');
    await expect(css(region, 'overflow-x')).toBe('auto');

    const plain = canvas.getByRole('table', { name: 'table.ilw-table' });
    const head = plain.querySelector('thead th')!;
    await expect(css(plain, 'border-collapse')).toBe('collapse');
    // Illinois Blue head, white text (the white palette).
    await expect(css(head, 'background-color')).toBe('rgb(19, 41, 75)');
    await expect(css(head, 'color')).toBe('rgb(255, 255, 255)');
    await expect(css(head, 'font-weight')).toBe('700');
    await expect(css(plain.querySelector('td')!, 'vertical-align')).toBe('top');

    // A bare table inside .ilw-format gets the same look.
    const bare = canvas.getByRole('table', { name: 'A bare table inside .ilw-format' });
    await expect(css(bare.querySelector('thead th')!, 'background-color')).toBe(css(head, 'background-color'));

    // Stripes on even body rows only.
    const striped = canvas.getByRole('table', { name: '.ilw-table-stripe' });
    const [r1, r2] = striped.querySelectorAll('tbody tr');
    await expect(css(r1, 'background-color')).not.toBe(css(r2, 'background-color'));

    // A whole-table theme recolours the cells' text too; blue-light only the head.
    const blue = canvas.getByRole('table', { name: '.ilw-theme-table-blue' });
    await expect(css(blue.querySelector('td')!, 'color')).not.toBe(css(plain.querySelector('td')!, 'color'));
    const light = canvas.getByRole('table', { name: '.ilw-theme-table-blue-light' });
    await expect(css(light.querySelector('td')!, 'color')).toBe(css(plain.querySelector('td')!, 'color'));
    await expect(css(light.querySelector('thead th')!, 'background-color')).toBe(css(blue.querySelector('thead th')!, 'background-color'));
  }}
/>

<!--
  Both sides, one row per variant, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** each row's two frames look the same. Switch the toolbar theme to Dark to see ilw-ui's dark values next to the (light-only) toolkit.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide
      pair="parity-table"
      theme={String(context.globals.theme ?? 'light')}
      height={340}
      rows={TABLE_VARIANTS.map((v) => ({ label: v.label, args: { variant: v.id } }))}
    />
  {/snippet}
</Story>
