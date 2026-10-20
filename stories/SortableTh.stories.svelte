<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn } from 'storybook/test';

  import SortableTh from '../src/svelte/SortableTh.svelte';
  import SortableTable from './SortableTable.svelte';

  const { Story } = defineMeta({
    title: 'SortableTh',
    // The Docs page lists every story with its review notes (the comment above it).
    tags: ['autodocs'],
    component: SortableTh,
    args: { key: 'name', label: 'Name', onsort: fn() },
    // ilw-ui's table.css only, no toolkit: the tables carry class="ilw-table".
    parameters: { styles: 'ilw-ui' },
  });

  const NBSP = ' ';
</script>

{#snippet template(args: { key: string; label: string; sort: { key: string; dir: 1 | -1 }; onsort: (key: string) => void })}
  <table class="ilw-table">
    <thead><tr><SortableTh {...args} /></tr></thead>
    <tbody><tr><td>Avery</td></tr></tbody>
  </table>
{/snippet}

<!--
  A heading that isn't the sorted column.

  **Why:** the README fixes the `th`/button markup as the DOM contract (ta-manager selects on `th-sort` and `data-sort`). An unsorted heading carries no `aria-sort` and no arrow, so a screen reader doesn't announce a sort that isn't there.

  **Review:** the heading looks like plain header text, and underlines on hover. Clicking it calls `onsort('name')` (see the Actions panel).
-->
<Story
  name="Unsorted"
  args={{ sort: { key: 'hours', dir: 1 } }}
  {template}
  play={async ({ canvas, userEvent, args }) => {
    const th = canvas.getByRole('columnheader');
    const button = canvas.getByRole('button', { name: 'Name' });
    await expect(th).toHaveAttribute('scope', 'col');
    await expect(th).not.toHaveAttribute('aria-sort');
    await expect(button).toHaveAttribute('type', 'button');
    await expect(button).toHaveAttribute('data-sort', 'name');
    await expect(button.className).toBe('th-sort');
    await expect(button.textContent).toBe('Name');
    await expect(button.querySelector('span')).toBeNull();
    await userEvent.click(button);
    await expect(args.onsort).toHaveBeenCalledWith('name');
  }}
/>

<!--
  The sorted column, ascending.

  **Why:** `aria-sort="ascending"` is what screen readers announce. The ↑ is decorative and `aria-hidden`, so the button's name stays just "Name".

  **Review:** the heading shows "Name ↑", with a non-breaking space so the arrow never wraps onto its own line.
-->
<Story
  name="Ascending"
  args={{ sort: { key: 'name', dir: 1 } }}
  {template}
  play={async ({ canvas }) => {
    const th = canvas.getByRole('columnheader');
    const button = canvas.getByRole('button', { name: 'Name' });
    await expect(th).toHaveAttribute('aria-sort', 'ascending');
    await expect(button.className).toBe('th-sort on');
    await expect(button.textContent).toBe(`Name${NBSP}↑`);
    const spans = button.querySelectorAll('span');
    await expect(spans).toHaveLength(1);
    await expect(spans[0]).toHaveAttribute('aria-hidden', 'true');
    await expect(spans[0].textContent).toBe(`${NBSP}↑`);
  }}
/>

<!--
  The sorted column, descending.

  **Review:** the heading shows "Name ↓", and the arrow is hidden from screen readers.
-->
<Story
  name="Descending"
  args={{ sort: { key: 'name', dir: -1 } }}
  {template}
  play={async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'Name' });
    await expect(canvas.getByRole('columnheader')).toHaveAttribute('aria-sort', 'descending');
    await expect(button.className).toBe('th-sort on');
    await expect(button.textContent).toBe(`Name${NBSP}↓`);
    await expect(button.querySelector('span[aria-hidden="true"]')?.textContent).toBe(`${NBSP}↓`);
  }}
/>

<!--
  Has no `play` function: it is the starting page for `tests/e2e/sortable-th.spec.ts`. Three headings, sorted with `nextSort`.

  **Review:** tab to a heading and press Enter or Space. The rows re-sort, and focus stays on the same button rather than dropping to `<body>` when the table re-renders.
-->
<Story name="Table" asChild>
  <SortableTable />
</Story>

<!--
  The same table, sorted by mouse.

  **Why:** `nextSort` flips the current column and starts a new column ascending. The heading buttons must survive the re-render, so focus isn't lost.

  **Review:** click Name: the rows reverse (Casey first). Click Hours: the rows sort by hours, Blake first, and the arrow moves to Hours.
-->
<Story
  name="Click sorts"
  asChild
  play={async ({ canvas, userEvent }) => {
    const firstCells = () => canvas.getAllByRole('row').slice(1).map((r) => r.firstElementChild?.textContent);
    const [nameTh, courseTh, hoursTh] = canvas.getAllByRole('columnheader');
    const nameBtn = canvas.getByRole('button', { name: 'Name' });
    const hoursBtn = canvas.getByRole('button', { name: 'Hours' });

    await expect(nameTh).toHaveAttribute('aria-sort', 'ascending');
    await expect(courseTh).not.toHaveAttribute('aria-sort');
    await expect(firstCells()).toEqual(['Avery', 'Blake', 'Casey']);

    await userEvent.click(nameBtn);
    await expect(nameTh).toHaveAttribute('aria-sort', 'descending');
    await expect(firstCells()).toEqual(['Casey', 'Blake', 'Avery']);
    await expect(nameBtn).toHaveFocus();
    await expect(nameBtn.isConnected).toBe(true);

    await userEvent.click(hoursBtn);
    await expect(nameTh).not.toHaveAttribute('aria-sort');
    await expect(nameBtn.className).toBe('th-sort');
    await expect(hoursTh).toHaveAttribute('aria-sort', 'ascending');
    await expect(hoursBtn.className).toBe('th-sort on');
    await expect(firstCells()).toEqual(['Blake', 'Casey', 'Avery']);
    await expect(hoursBtn).toHaveFocus();
  }}
>
  <SortableTable />
</Story>
