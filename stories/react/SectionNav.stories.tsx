import type { Meta, StoryObj } from '@storybook/react-vite';

import { SectionNav } from '../../src/react/SectionNav.tsx';
import * as plays from '../plays/section-nav.ts';
import { programs } from '../section-nav-data.ts';

// The React twin of stories/SectionNav.stories.svelte. The section nav (B6),
// ilw-ui's styles only, in the page shell's main.
const meta = {
  title: 'Page Chrome/Section nav',
  parameters: { styles: 'ilw-ui' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `SectionNav` as a server renders it: the current page's branches open, the rest closed. No play function: the keyboard spec (`tests/e2e/page-chrome.spec.ts`) drives this one from a fresh load.
 *
 * **Why:** the fixture for the toggle checks (Enter and Space on a `summary`, the narrow-width "Pages In This Section" toggle).
 *
 * **Review:** "Undergraduate Degrees" and "Animal Sciences Major" are open down to the current page, which is orange with a small triangle. Each branch has a chevron at its right: Tab reaches the link, then the chevron; Enter or Space toggles it. Narrower than 700 px the list hides behind "Pages In This Section".
 */
export const Fixture: Story = {
  name: 'Fixture',
  render: () => (
    <div style={{ maxWidth: '20rem' }}>
      <SectionNav items={programs} />
    </div>
  ),
};

/**
 * Every disclosure open: the narrow-width toggle (`open`) and every branch (`expanded`), as the toolkit always shows them.
 *
 * **Why:** the "open" story, so axe scans every link. The play function checks the contract: a nav named by the toggle's summary, the root link, link-plus-toggle siblings, the toggles' names, `open` on the current page's ancestors and `aria-current="page"` on it.
 *
 * **Review:** the whole tree shows, indented by level, with each chevron pointing up.
 */
export const Open: Story = {
  name: 'Open',
  render: () => (
    <div style={{ maxWidth: '20rem' }}>
      <SectionNav items={programs} open expanded />
    </div>
  ),
  play: plays.open,
};

/**
 * The default: only the current page's ancestors open, and the play function checks that.
 *
 * **Why:** `SectionNav` sets `open` from `current`, so the server sends the current branch open without script.
 *
 * **Review:** as **Fixture**.
 */
export const CurrentBranch: Story = {
  name: 'Current branch',
  render: () => (
    <div style={{ maxWidth: '20rem' }}>
      <SectionNav items={programs} />
    </div>
  ),
  play: plays.currentBranch,
};

/**
 * The same open nav with `html[data-theme="dark"]`.
 *
 * **Why:** the colours come from the theme properties, so dark mode follows without per-component rules. axe checks the dark contrast.
 *
 * **Review:** light text on the dark page; the root link and toggle on the dark grey plate.
 */
export const Dark: Story = {
  name: 'Dark',
  globals: { theme: 'dark' },
  render: () => (
    <div style={{ maxWidth: '20rem' }}>
      <SectionNav items={programs} open expanded />
    </div>
  ),
};
