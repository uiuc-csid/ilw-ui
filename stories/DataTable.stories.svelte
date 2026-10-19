<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, waitFor, within } from 'storybook/test';

  import DataTableDemo from './DataTableDemo.svelte';
  import { byGroup, byName, people, stableSorted } from './table-data.ts';

  const { Story } = defineMeta({
    title: 'DataTable',
    component: DataTableDemo,
  });

  const NBSP = '\u00a0';
  const rowIds = (root: HTMLElement) => [...root.querySelectorAll('tbody tr[data-id]')].map((tr) => tr.getAttribute('data-id'));
  const pagers = (root: HTMLElement) => [...root.querySelectorAll<HTMLElement>('nav, .picker-ctrl-row')];
  const current = (pager: HTMLElement) => pager.querySelector('[aria-current="page"], .picker-tog-on')?.textContent;

  /** The element serialized without Svelte's comment anchors. */
  function markup(el: Element): string {
    const copy = el.cloneNode(true) as Element;
    const walker = document.createTreeWalker(copy, NodeFilter.SHOW_COMMENT);
    const comments: Node[] = [];
    while (walker.nextNode()) comments.push(walker.currentNode);
    for (const c of comments) c.parentNode?.removeChild(c);
    return new XMLSerializer().serializeToString(copy);
  }

  /** HTML parsed and serialized the same way. */
  function parsed(html: string): string {
    return markup(new DOMParser().parseFromString(html, 'text/html').body.firstElementChild!);
  }

  // What ta-manager's unranked-courses-module.js builds for page 1 of 6.
  const legacyPager =
    '<div class="picker-ctrl-row"><span class="picker-sort-lbl">Page:</span>' +
    '<button class="picker-tog picker-pg-btn" data-page="0" disabled>‹</button>' +
    '<button class="picker-tog picker-pg-btn picker-tog-on" data-page="1">1</button>' +
    '<button class="picker-tog picker-pg-btn" data-page="2">2</button>' +
    '<button class="picker-tog picker-pg-btn" data-page="3">3</button>' +
    '<span class="picker-pg-ellipsis">…</span>' +
    '<button class="picker-tog picker-pg-btn" data-page="6">6</button>' +
    '<button class="picker-tog picker-pg-btn" data-page="2">›</button>' +
    '<span class="picker-count">1–25 of 131</span></div>';
</script>

<Story
  name="Sortable"
  args={{ count: 30 }}
  play={async ({ canvas, canvasElement, userEvent }) => {
    const table = canvas.getByRole('table', { name: 'People' });
    await expect(table.className).toBe('people');
    const [nameTh, groupTh] = canvas.getAllByRole('columnheader');
    const name = canvas.getByRole('button', { name: 'Name' });
    const group = canvas.getByRole('button', { name: 'Group' });
    const list = people(30);

    // SortableTh's DOM contract, unchanged.
    await expect(nameTh).toHaveAttribute('scope', 'col');
    await expect(nameTh).toHaveAttribute('aria-sort', 'ascending');
    await expect(name).toHaveAttribute('type', 'button');
    await expect(name).toHaveAttribute('data-sort', 'name');
    await expect(name.className).toBe('th-sort on');
    await expect(name.textContent).toBe(`Name${NBSP}↑`);
    await expect(name.querySelector('span')).toHaveAttribute('aria-hidden', 'true');
    await expect(groupTh).not.toHaveAttribute('aria-sort');
    await expect(group.className).toBe('th-sort');
    await expect(group.textContent).toBe('Group');
    await expect(rowIds(canvasElement)).toEqual(stableSorted(list, byName, 1));

    // The sorted column flips; ties keep their input order in both directions.
    await userEvent.click(name);
    await expect(nameTh).toHaveAttribute('aria-sort', 'descending');
    await expect(name.textContent).toBe(`Name${NBSP}↓`);
    await expect(rowIds(canvasElement)).toEqual(stableSorted(list, byName, -1));
    await expect(name).toHaveFocus();

    // Another column starts ascending.
    await userEvent.click(group);
    await expect(nameTh).not.toHaveAttribute('aria-sort');
    await expect(name.className).toBe('th-sort');
    await expect(groupTh).toHaveAttribute('aria-sort', 'ascending');
    await expect(rowIds(canvasElement)).toEqual(stableSorted(list, byGroup, 1));
    await userEvent.click(group);
    await expect(rowIds(canvasElement)).toEqual(stableSorted(list, byGroup, -1));
    await expect(group).toHaveFocus();
  }}
/>

<Story
  name="Keyed rows"
  args={{ count: 4 }}
  play={async ({ canvas, canvasElement, userEvent }) => {
    const before = canvasElement.querySelector('tr[data-id="r1"]');
    await userEvent.click(canvas.getByRole('button', { name: 'Rename r1' }));
    const after = canvasElement.querySelector('tr[data-id="r1"]');
    await expect(after).toBe(before);
    await expect(after?.firstElementChild?.textContent).toBe('Person zz');
    // Re-sorted by name: "Person zz" goes last.
    await expect(rowIds(canvasElement).at(-1)).toBe('r1');
  }}
/>

<Story
  name="Filtered"
  args={{ count: 20 }}
  play={async ({ canvas, canvasElement, userEvent }) => {
    const filter = canvas.getByRole('searchbox', { name: 'Filter' });
    await userEvent.type(filter, 'person 0');
    const expected = people(20).filter((r) => r.name.toLowerCase().includes('person 0'));
    await waitFor(() => expect(new Set(rowIds(canvasElement))).toEqual(new Set(expected.map((r) => r.id))));
    await userEvent.clear(filter);
    await userEvent.type(filter, 'nobody');
    const body = canvasElement.querySelector('tbody')!;
    await waitFor(() => expect(body.textContent?.trim()).toBe('None.'));
    await expect(body.querySelector('td')).toHaveAttribute('colspan', '2');
    // '' stays a filter value; the predicate lets every row through.
    await userEvent.clear(filter);
    await waitFor(() => expect(rowIds(canvasElement)).toHaveLength(20));
  }}
/>

<Story
  name="Paged legacy"
  args={{ count: 131, pageSize: 25, legacy: true }}
  play={async ({ canvas, canvasElement, userEvent }) => {
    // `legacy` renders the legacy markup, byte for byte.
    const [top, bottom] = pagers(canvasElement);
    await expect(markup(top)).toBe(parsed(legacyPager));
    await expect(markup(bottom)).toBe(parsed(legacyPager));
    await expect(canvasElement.querySelector('nav, [aria-current], [aria-label="Next page"]')).toBeNull();

    await userEvent.click(within(top).getByRole('button', { name: '3' }));
    await expect(current(top)).toBe('3');
    await expect(current(bottom)).toBe('3');
    await expect(bottom.querySelector('.picker-count')?.textContent).toBe('51–75 of 131');
    await userEvent.click(canvas.getByRole('button', { name: 'Group' }));
    await expect(current(top)).toBe('1');
  }}
/>

<Story
  name="Paged"
  args={{ count: 131, pageSize: 25 }}
  play={async ({ canvas, canvasElement, userEvent }) => {
    const [top, bottom] = pagers(canvasElement);
    await expect(top).toHaveAccessibleName('Pages, top');
    await expect(top.className).toBe('ilw-pager');
    const pager = within(top);
    const prev = pager.getByRole('button', { name: 'Previous page' });
    const next = pager.getByRole('button', { name: 'Next page' });
    for (const button of top.querySelectorAll('button')) await expect(button).toHaveAttribute('type', 'button');
    await expect(prev).toBeDisabled();
    await expect(prev).toHaveAttribute('data-page', '0');
    await expect(prev.textContent).toBe('‹');
    await expect(next).toHaveAttribute('data-page', '2');
    await expect(next.textContent).toBe('›');
    await expect(
      [...top.children].map((el) => (el.matches('button:not([aria-label])') ? el.textContent : el.className)),
    ).toEqual([
      'ilw-pager-label',
      'ilw-pager-btn',
      '1',
      '2',
      '3',
      'ilw-pager-ellipsis',
      '6',
      'ilw-pager-btn',
      'ilw-pager-count',
    ]);
    const one = pager.getByRole('button', { name: '1' });
    await expect(one).toHaveAttribute('aria-current', 'page');
    await expect(one.className).toBe('ilw-pager-btn on');
    await expect(pager.getByRole('button', { name: '2' })).not.toHaveAttribute('aria-current');
    await expect(top.querySelector('.ilw-pager-count')?.textContent).toBe('1–25 of 131');

    // Both pagers stay in step with the rows.
    const sorted = stableSorted(people(131), byName, 1);
    await expect(rowIds(canvasElement)).toEqual(sorted.slice(0, 25));
    await userEvent.click(pager.getByRole('button', { name: '3' }));
    await expect(rowIds(canvasElement)).toEqual(sorted.slice(50, 75));
    await expect(current(bottom)).toBe('3');
    await expect(bottom.querySelector('.ilw-pager-count')?.textContent).toBe('51–75 of 131');

    // A sort goes back to page 1.
    await userEvent.click(canvas.getByRole('button', { name: 'Group' }));
    await expect(current(top)).toBe('1');
    await expect(current(bottom)).toBe('1');

    // So does a filter; with no rows, the count is the empty label.
    await userEvent.click(pager.getByRole('button', { name: '2' }));
    await expect(current(top)).toBe('2');
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Filter' }), 'person 0');
    await waitFor(() => expect(current(top)).toBe('1'));
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Filter' }), 'x');
    await waitFor(() => expect(top.querySelector('.ilw-pager-count')?.textContent).toBe('No people'));
    await expect(pager.getByRole('button', { name: 'Next page' })).toBeDisabled();
  }}
/>

<Story
  name="Pager classes"
  args={{ count: 60, pageSize: 25, classes: { root: 'pages', current: 'is-current' } }}
  play={async ({ canvasElement }) => {
    // Each class given replaces its default; the rest stay.
    const top = canvasElement.querySelector<HTMLElement>('.pages')!;
    await expect(top.querySelector('span')?.className).toBe('ilw-pager-label');
    await expect(top.querySelector('.is-current')?.className).toBe('ilw-pager-btn is-current');
    await expect(top.querySelector('.is-current')).toHaveAttribute('aria-current', 'page');
    await expect(top.querySelector('.ilw-pager-count')?.textContent).toBe('1–25 of 60');
    await expect(top.querySelector('.on')).toBeNull();
  }}
/>

<!-- Fixtures for the Playwright keyboard spec: no play function. -->
<Story name="Fixture" args={{ count: 30 }} />
<Story name="Fixture paged" args={{ count: 131, pageSize: 25 }} />
<Story name="Fixture paged legacy" args={{ count: 131, pageSize: 25, legacy: true }} />
