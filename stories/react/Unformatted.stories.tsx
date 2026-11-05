import type { Meta, StoryObj } from '@storybook/react-vite';

import * as ilw from '../../src/react/index.ts';
import * as plays from '../plays/unformatted.ts';
import { programs } from '../section-nav-data.ts';

// The React twin of stories/Unformatted.stories.svelte. The Page shell without
// .ilw-format (`format: false`): a component that leans on the prose styles for
// its font falls back to the browser's serif here.
//
// One group per row of docs/plans/2026-10-27-react-components.md, so ports
// running side by side each add their stories under their own comment. Stories
// render `ilw.X`, so no port edits a shared import line, and the exports can
// take the components' names (`Breadcrumbs`), as the Svelte stories' do.
const meta = {
  title: 'Unformatted',
  parameters: { styles: 'ilw-ui', format: false },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// R1 layout, Button, Icon: Button, Icon

// R1 page chrome: Breadcrumbs, Pagination, Page Title, Section Nav, Footer
/**
 * `Breadcrumbs` outside `.ilw-format`.
 *
 * **Why:** the play function checks the links and the current page are in Source Sans without the prose styles.
 *
 * **Review:** matches **Parity/Breadcrumbs → IlwUi**.
 */
export const Breadcrumbs: Story = {
  name: 'Breadcrumbs',
  render: () => <ilw.Breadcrumbs items={[{ label: 'Home', href: '#home' }]} current="Degree programs" />,
  play: plays.breadcrumbs,
};

/**
 * `Pagination` outside `.ilw-format`.
 *
 * **Why:** the play function checks the links, the ellipsis, the disabled Previous and the page count are in Source Sans without the prose styles.
 *
 * **Review:** matches **Parity/Pagination → IlwUi**, default theme.
 */
export const Pagination: Story = {
  name: 'Pagination',
  render: () => <ilw.Pagination page={1} pages={8} href={(p) => `#page-${p}`} />,
  play: plays.pagination,
};

/**
 * `PageTitle` outside `.ilw-format`.
 *
 * **Why:** the play function checks the title is in Source Sans without the prose styles.
 *
 * **Review:** matches **Parity/PageTitle → IlwUi**, default theme.
 */
export const PageTitle: Story = {
  name: 'Page Title',
  render: () => <ilw.PageTitle>Graduate Programs</ilw.PageTitle>,
  play: plays.pageTitle,
};

/**
 * `SectionNav`, every branch open, outside `.ilw-format`.
 *
 * **Why:** the play function checks the links are in Source Sans without the prose styles.
 *
 * **Review:** matches **Parity/SectionNav → IlwUi**.
 */
export const SectionNav: Story = {
  name: 'Section Nav',
  render: () => (
    <div style={{ maxWidth: '20rem' }}>
      <ilw.SectionNav items={programs} expanded />
    </div>
  ),
  play: plays.sectionNav,
};

/**
 * `Footer` outside `.ilw-format`.
 *
 * **Why:** the play function checks the site name, a campus heading and the legal row are in Source Sans without the prose styles.
 *
 * **Review:** matches **Parity/Footer → Site Name Only**.
 */
export const Footer: Story = {
  name: 'Footer',
  parameters: { shell: false },
  render: () => <ilw.Footer siteName="Sample Site" />,
  play: plays.footer,
};

// R2 forms: Field, ChoiceChips

// R3 islands and header: Header

// R5 data: Data Table

// R10 accordion: Accordion

// R11 alert: Alert

// R12 toggle group: Toggle Group
