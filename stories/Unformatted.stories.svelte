<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Envelope from 'phosphor-svelte/lib/Envelope';
  import { expect } from 'storybook/test';

  import { Breadcrumbs, Button, Footer, Icon, PageTitle } from '../src/svelte/index.ts';
  import DataTableDemo from './DataTableDemo.svelte';
  import TableSample from './parity/TableSample.svelte';

  // The Page shell without .ilw-format (`format: false`): a component that
  // leans on the prose styles for its font falls back to the browser's serif here.
  const { Story } = defineMeta({
    title: 'Unformatted',
    parameters: { styles: 'ilw-ui', format: false },
  });

  /** Checks each element's text is in the brand sans font (Source Sans), not the browser default. */
  async function brandSans(elements: Iterable<Element>) {
    const all = [...elements];
    await expect(all.length).toBeGreaterThan(0);
    await expect(document.querySelector('.ilw-format')).toBeNull();
    for (const el of all) {
      await expect(getComputedStyle(el).fontFamily, `font of ${el.textContent?.trim().slice(0, 30)}`).toMatch(/^"?Source Sans/);
    }
  }
</script>

<!--
  `Button`, link and button, outside `.ilw-format`.

  **Why:** the play function checks the label is in Source Sans without the prose styles.

  **Review:** the labels look the same as on **Button → Sizes And Themes**.
-->
<Story name="Button" play={({ canvasElement }) => brandSans(canvasElement.querySelectorAll('.ilw-button'))}>
  <p><Button href="#unformatted">Link button</Button> <Button>Plain button</Button></p>
</Story>

<!--
  `Icon` in an `.ilw-icon-row` and beside text, outside `.ilw-format`.

  **Why:** an icon has no text of its own: it is 1em in the text's colour, so it follows whatever font the page sets (here the browser's serif). The play function checks it still sizes and colours itself from that text.

  **Review:** the envelope sits beside its line, sized to the text.
-->
<Story
  name="Icon"
  play={async ({ canvasElement }) => {
    await expect(document.querySelector('.ilw-format')).toBeNull();
    const row = canvasElement.querySelector<HTMLElement>('.ilw-icon-row')!;
    const svg = row.querySelector('svg')!;
    await expect(svg).toHaveClass('ilw-icon');
    await expect(svg.getBoundingClientRect().height).toBeCloseTo(parseFloat(getComputedStyle(row).fontSize), 0);
    await expect(getComputedStyle(svg).fill).toBe(getComputedStyle(row).color);
  }}
>
  <div class="ilw-icon-row">
    <Icon icon={Envelope} />
    <p>Email the department office.</p>
  </div>
</Story>

<!--
  `Breadcrumbs` outside `.ilw-format`.

  **Why:** the play function checks the links and the current page are in Source Sans without the prose styles.

  **Review:** matches **Parity/Breadcrumbs → IlwUi**.
-->
<Story name="Breadcrumbs" play={({ canvasElement }) => brandSans(canvasElement.querySelectorAll('.ilw-breadcrumbs li > *'))}>
  <Breadcrumbs items={[{ label: 'Home', href: '#home' }]} current="Degree programs" />
</Story>

<!--
  `PageTitle` outside `.ilw-format`.

  **Why:** the play function checks the title is in Source Sans without the prose styles.

  **Review:** matches **Parity/PageTitle → IlwUi**, default theme.
-->
<Story name="Page Title" play={({ canvasElement }) => brandSans(canvasElement.querySelectorAll('.ilw-page-title h1'))}>
  <PageTitle>Graduate Programs</PageTitle>
</Story>

<!--
  `Footer` outside `.ilw-format`.

  **Why:** the play function checks the site name, a campus heading and the legal row are in Source Sans without the prose styles.

  **Review:** matches **Parity/Footer → Site Name Only**.
-->
<Story
  name="Footer"
  parameters={{ shell: false }}
  play={({ canvasElement }) =>
    brandSans(canvasElement.querySelectorAll('.ilw-footer-site-name, .ilw-footer-campus h3, .ilw-footer-legal li'))}
>
  <Footer>
    {#snippet siteName()}Sample Site{/snippet}
  </Footer>
</Story>

<!--
  `table.ilw-table` outside `.ilw-format`.

  **Why:** the play function checks the caption, head and body cells are in Source Sans without the prose styles.

  **Review:** matches the striped table on **Parity/Table → IlwUi**.
-->
<Story
  name="Table"
  play={({ canvasElement }) => brandSans(canvasElement.querySelectorAll('table caption, table th, table td'))}
>
  <TableSample variant="stripe" />
</Story>

<!--
  A paged `DataTable` (sortable headings, filter field, `Pager`) outside `.ilw-format`.

  **Why:** the play function checks the sort buttons, cells, pager buttons and count are in Source Sans without the prose styles.

  **Review:** matches **DataTable → Paged**.
-->
<Story
  name="Data Table"
  play={({ canvasElement }) =>
    brandSans(canvasElement.querySelectorAll('.th-sort, table td, .ilw-pager-btn, .ilw-pager-count'))}
>
  <DataTableDemo count={8} pageSize={3} />
</Story>
