<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, fn } from 'storybook/test';

  import SortableTh from '../src/svelte/SortableTh.svelte';
  import SortableTable from './SortableTable.svelte';

  const { Story } = defineMeta({
    title: 'SortableTh',
    component: SortableTh,
    args: { key: 'name', label: 'Name', onsort: fn() },
  });

  const NBSP = ' ';
</script>

{#snippet template(args: { key: string; label: string; sort: { key: string; dir: 1 | -1 }; onsort: (key: string) => void })}
  <table>
    <thead><tr><SortableTh {...args} /></tr></thead>
    <tbody><tr><td>Avery</td></tr></tbody>
  </table>
{/snippet}

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

<!-- Fixture for the Playwright keyboard spec: no play function. -->
<Story name="Table" asChild>
  <SortableTable />
</Story>

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
