<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Envelope from 'phosphor-svelte/lib/Envelope';
  import { expect } from 'storybook/test';

  import { Alert, Breadcrumbs, Button, ChoiceChips, Field, Footer, Header, Icon, PageTitle, Pagination, SectionNav } from '../src/svelte/index.ts';
  import DataTableDemo from './DataTableDemo.svelte';
  import TableSample from './parity/TableSample.svelte';
  import { programs } from './section-nav-data.ts';

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
  `Field`, with help text and an error, and a switch, outside `.ilw-format`.

  **Why:** the play function checks the label, the control, the help text and the error are in Source Sans without the prose styles.

  **Review:** the same type as on **Forms → Field → Error**.
-->
<Story
  name="Field"
  play={({ canvasElement }) =>
    brandSans(canvasElement.querySelectorAll('.ilw-input-entry label, .ilw-input-entry input, .ilw-input-description, .ilw-input-alert'))}
>
  <Field label="Email" description="We only use it to reply." error="Enter an email address.">
    {#snippet children(attrs)}<input type="email" name="email" {...attrs} />{/snippet}
  </Field>
</Story>

<!--
  `ChoiceChips`, with help text and an error, outside `.ilw-format`.

  **Why:** the play function checks the legend, the chips, the help text and the error are in Source Sans without the prose styles.

  **Review:** the same type as on **Forms → ChoiceChips → Error**.
-->
<Story
  name="ChoiceChips"
  play={({ canvasElement }) => brandSans(canvasElement.querySelectorAll('.ilw-chips legend, .ilw-chip, .ilw-input-description, .ilw-input-alert'))}
>
  <ChoiceChips
    legend="Country"
    name="country"
    options={[
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
    ]}
    value="us"
    description="Applicants are counted by home country."
    error="Choose a country."
  />
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
  `Header` outside `.ilw-format`, with every part.

  **Why:** the play function checks the site name, links, search and nav items are in Source Sans without the prose styles.

  **Review:** matches **Parity/Header → IlwUi**.
-->
<Story
  name="Header"
  play={({ canvasElement }) =>
    brandSans(
      canvasElement.querySelectorAll(
        '.ilw-header :is(.ilw-header-parent-unit, .ilw-header-site-name, .ilw-header-toggle, .ilw-header-links a, .ilw-header-search input, .ilw-header-search button, .ilw-header-nav a, .ilw-header-nav summary)',
      ),
    )}
>
  <Header
    siteName="Sample Site"
    siteHref="#home"
    parentUnit={{ label: 'Parent Unit', href: '#parent' }}
    links={[{ label: 'Apply', href: '#apply' }]}
    search={{ action: '#search' }}
    nav={[
      { label: 'About', href: '#about' },
      { label: 'Programs', children: [{ label: 'Majors', href: '#majors' }] },
    ]}
  />
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
  `Pagination` outside `.ilw-format`.

  **Why:** the play function checks the links, the ellipsis, the disabled Previous and the page count are in Source Sans without the prose styles.

  **Review:** matches **Parity/Pagination → IlwUi**, default theme.
-->
<Story
  name="Pagination"
  play={({ canvasElement }) => brandSans(canvasElement.querySelectorAll('.ilw-pagination li > *, .ilw-pagination-count'))}
>
  <Pagination page={1} pages={8} href={(p) => `#page-${p}`} />
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
  `SectionNav`, every branch open, outside `.ilw-format`.

  **Why:** the play function checks the links are in Source Sans without the prose styles.

  **Review:** matches **Parity/SectionNav → IlwUi**.
-->
<Story name="Section Nav" play={({ canvasElement }) => brandSans(canvasElement.querySelectorAll('.ilw-section-nav a'))}>
  <div style:max-width="20rem">
    <SectionNav items={programs} expanded />
  </div>
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

<!--
  `Alert`, a warning with a title, a message and an action, outside `.ilw-format`.

  **Why:** the card sets its own font, so the play function checks the title, the message and the action are in Source Sans without the prose styles, and the paragraphs keep the card's own margins.

  **Review:** the same type and spacing as on **Components → Alert → Warning**.
-->
<Story
  name="Alert"
  play={async ({ canvasElement }) => {
    await brandSans(canvasElement.querySelectorAll('.ilw-alert-title, .ilw-alert-body > p, .ilw-alert-actions .ilw-button'));
    await expect(getComputedStyle(canvasElement.querySelector('.ilw-alert-title')!).marginTop).toBe('0px');
  }}
>
  <Alert variant="warning" title="Applications close Friday at 5 p.m.">
    <p>Your application is missing a course preference.</p>
    {#snippet actions()}<Button href="#review">Review application</Button>{/snippet}
  </Alert>
</Story>
