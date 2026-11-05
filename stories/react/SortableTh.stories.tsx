import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { SortableTh } from '../../src/react/SortableTh.tsx';
import * as plays from '../plays/sortable-th.ts';
import { SortableTable } from './SortableTable.tsx';

// The React twin of stories/SortableTh.stories.svelte.
const meta = {
  title: 'SortableTh',
  // The Docs page lists every story with its review notes (the comment above it).
  tags: ['autodocs'],
  component: SortableTh,
  args: { sortKey: 'name', label: 'Name', onSort: fn() },
  // ilw-ui's table.css only, no toolkit: the tables carry className="ilw-table".
  parameters: { styles: 'ilw-ui' },
  render: (args) => (
    <table className="ilw-table">
      <thead>
        <tr>
          <SortableTh {...args} />
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Avery</td>
        </tr>
      </tbody>
    </table>
  ),
} satisfies Meta<typeof SortableTh>;

export default meta;
type Story = StoryObj<typeof meta>;
/** A story that renders its own demo instead of the meta's table, so it takes no args. */
type DemoStory = StoryObj;

/**
 * A heading that isn't the sorted column.
 *
 * **Why:** the README fixes the `th`/button markup as the DOM contract (ta-manager selects on `th-sort` and `data-sort`). An unsorted heading carries no `aria-sort` and no arrow, so a screen reader doesn't announce a sort that isn't there.
 *
 * **Review:** the heading looks like plain header text, and underlines on hover. Clicking it calls `onsort('name')` (see the Actions panel).
 */
export const Unsorted: Story = {
  name: 'Unsorted',
  args: { sort: { key: 'hours', dir: 1 } },
  play: plays.unsorted,
};

/**
 * The sorted column, ascending.
 *
 * **Why:** `aria-sort="ascending"` is what screen readers announce. The ↑ is decorative and `aria-hidden`, so the button's name stays just "Name".
 *
 * **Review:** the heading shows "Name ↑", with a non-breaking space so the arrow never wraps onto its own line.
 */
export const Ascending: Story = {
  name: 'Ascending',
  args: { sort: { key: 'name', dir: 1 } },
  play: plays.ascending,
};

/**
 * The sorted column, descending.
 *
 * **Why:** the play function checks the descending state: `aria-sort="descending"` on the `th`, `th-sort on` on the button, and the arrow in an `aria-hidden` span so the accessible name stays "Name".
 *
 * **Review:** the heading shows "Name ↓", and the arrow is hidden from screen readers.
 */
export const Descending: Story = {
  name: 'Descending',
  args: { sort: { key: 'name', dir: -1 } },
  play: plays.descending,
};

/**
 * Has no `play` function: it is the starting page for `tests/e2e/sortable-th.spec.ts`. Three headings, sorted with `nextSort`.
 *
 * **Why:** Storybook runs a story's `play` function whenever it loads, so a spec needs a story without one to start from a clean state.
 *
 * **Review:** tab to a heading and press Enter or Space. The rows re-sort, and focus stays on the same button rather than dropping to `<body>` when the table re-renders.
 */
export const Table: DemoStory = {
  name: 'Table',
  render: () => <SortableTable />,
};

/**
 * The same table, sorted by mouse.
 *
 * **Why:** `nextSort` flips the current column and starts a new column ascending. The heading buttons must survive the re-render, so focus isn't lost.
 *
 * **Review:** click Name: the rows reverse (Casey first). Click Hours: the rows sort by hours, Blake first, and the arrow moves to Hours.
 */
export const ClickSorts: DemoStory = {
  name: 'Click sorts',
  render: () => <SortableTable />,
  play: plays.clickSorts,
};
