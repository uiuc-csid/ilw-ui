import type { Meta, StoryObj } from '@storybook/react-vite';

import { Footer } from '../../../src/react/Footer.tsx';
import * as plays from '../../plays/footer.ts';

// The React twin of stories/parity/Footer.parity.stories.svelte: its IlwUi side
// and the other ilw-ui stories. No autodocs, as there. A footer is page-level (a
// content-info landmark), so no story goes inside the Storybook <main>.
const meta = { title: 'Parity/Footer', parameters: { shell: false } } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `Footer` with the same content, styled by ilw-ui's `footer.css` only. The campus links come from `campusFooter` in `ilw-ui/core`, not the network.
 *
 * **Why:** the play function checks the footer's contract: the three bands, the campus links with their UTM parameters, the legal links in the toolkit's order, and the landmark names. axe checks the colours.
 *
 * **Review:** matches **Toolkit**: the gray site band with a blue rule, the blue campus band with an orange rule, the legal row. Narrow the window: the campus sections go from three columns to two to one, and the site band stacks.
 */
export const IlwUi: Story = {
  name: 'IlwUi',
  parameters: { styles: 'ilw-ui' },
  render: () => (
    <Footer
      source="ilw_ui"
      cookiesButton
      legalLinks={[{ label: 'Terms of use', href: '#terms' }]}
      siteName={<a href="#home">Computer Science</a>}
      social={
        <>
          <li>
            <a href="#bluesky">Bluesky</a>
          </li>
          <li>
            <a href="#youtube">YouTube</a>
          </li>
        </>
      }
      address={
        <>
          <p>
            201 North Goodwin Avenue
            <br />
            Urbana, IL 61801
          </p>
          <p>
            Email: <a href="mailto:cs@example.com">cs@example.com</a>
          </p>
          <p>
            Phone: <a href="tel:+12175550000">(217) 555-0000</a>
          </p>
        </>
      }
      primaryUnit={<a href="#grainger">The Grainger College of Engineering</a>}
      actions={
        <>
          <a href="#give">Give</a> <a href="#apply">Apply</a>
        </>
      }
    >
      <nav className="ilw-footer-menu" aria-labelledby="menu-1">
        <h2 id="menu-1">Resources</h2>
        <ul>
          <li>
            <a href="#a">Advising</a>
          </li>
          <li>
            <a href="#b">Course explorer</a>
          </li>
        </ul>
      </nav>
    </Footer>
  ),
  play: plays.parity,
};

/**
 * The smallest footer: a site name only.
 *
 * **Why:** without actions, the content area moves up beside the site name (`ilw-footer-site--no-actions`); the campus and legal bands are always there.
 *
 * **Review:** a gray band with just the site name, then the campus and legal bands.
 */
export const SiteNameOnly: Story = {
  name: 'Site Name Only',
  parameters: { styles: 'ilw-ui' },
  render: () => <Footer siteName="Sample Site" />,
  play: plays.siteNameOnly,
};

/**
 * The campus content passed in through `campus`, replacing the vendored copy.
 *
 * **Why:** Brand can change the campus links before ilw-ui refreshes `campusFooter`; an app overrides them without waiting for a release. The play function checks the override replaces the sections and the legal links, and keeps the UTM parameters.
 *
 * **Review:** one campus section, "Override Section", and the legal row's privacy, copyright and accessibility links read "Override …".
 */
export const CampusOverride: Story = {
  name: 'Campus Override',
  parameters: { styles: 'ilw-ui' },
  render: () => (
    <Footer
      campus={{
        sections: [{ label: 'Override Section', links: [{ label: 'Override Link', href: 'https://example.illinois.edu/' }] }],
        privacy: { label: 'Override Privacy', href: 'https://example.illinois.edu/privacy' },
        copyright: { label: 'Override Copyright', href: 'https://example.illinois.edu/copyright' },
        accessibility: { label: 'Override Accessibility', href: 'https://example.illinois.edu/accessibility' },
      }}
      siteName="Sample Site"
    />
  ),
  play: plays.campusOverride,
};
