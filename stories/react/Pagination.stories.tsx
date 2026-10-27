import type { Meta, StoryObj } from '@storybook/react-vite';

import { Pagination } from '../../src/react/Pagination.tsx';
import * as plays from '../plays/pagination.ts';

// The React twin of stories/Pagination.stories.svelte. Links go to #page-N, so
// following one keeps the story loaded.
const meta = {
  title: 'Pagination',
  parameters: { styles: 'ilw-ui' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const href = (p: number) => `#page-${p}`;

/**
 * Page 6 of 12, with no play function.
 *
 * **Why:** the fixture for `tests/e2e/pagination.spec.ts` (Tab order, Enter follows a link).
 *
 * **Review:** Previous, 1 … 4 5 6 7 8 … 12, Next, then "Page 6 of 12". 6 is filled.
 */
export const Fixture: Story = {
  name: 'Fixture',
  render: () => <Pagination page={6} pages={12} href={href} />,
};

/**
 * The first and last pages, and a single page.
 *
 * **Why:** the play function checks Previous is text on the first page, Next is text on the last, and one page renders just "1" between two text labels.
 *
 * **Review:** three rows; the text Previous and Next aren't outlined.
 */
export const Ends: Story = {
  name: 'Ends',
  render: () => (
    <>
      <Pagination page={1} pages={8} href={href} label="Pages, first" />
      <Pagination page={8} pages={8} href={href} label="Pages, last" />
      <Pagination page={1} pages={1} href={href} label="Pages, single" />
    </>
  ),
  play: plays.ends,
};

/**
 * Links built from `url` and `parameter`, a 0-based `href`, an out-of-range `page`, and `hidePageCount`.
 *
 * **Why:** the play function checks `url`'s other query values and fragment survive, `parameter` names the query value, `href` replaces both, `page` is clamped to `1…pages`, and `hidePageCount` drops the count.
 *
 * **Review:** three rows; only the first has a page count.
 */
export const Links: Story = {
  name: 'Links',
  render: () => (
    <>
      <Pagination page={2} pages={5} url="?q=chem#results" parameter="p" label="Pages, query" />
      <Pagination page={2} pages={5} href={(p) => `?p=${p - 1}`} hidePageCount label="Pages, 0-based" />
      <Pagination page={9} pages={5} href={href} hidePageCount label="Pages, clamped" />
    </>
  ),
  play: plays.links,
};

/**
 * The default and a blue theme class on the nav.
 *
 * **Why:** the play function checks a theme class restyles it: on `ilw-theme-blue-1` the links are white on Illinois Blue.
 *
 * **Review:** the second row is blue, its current page white.
 */
export const Themes: Story = {
  name: 'Themes',
  render: () => (
    <>
      <Pagination page={3} pages={5} href={href} />
      <Pagination page={3} pages={5} href={href} label="Pages, blue" className="ilw-theme-blue-1" />
    </>
  ),
  play: plays.themes,
};
