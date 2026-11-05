import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment } from 'react';

import { Breadcrumbs } from '../../src/react/Breadcrumbs.tsx';
import { Footer } from '../../src/react/Footer.tsx';
import { Page } from '../../src/react/Page.tsx';
import { PageTitle } from '../../src/react/PageTitle.tsx';
import * as plays from '../plays/page.ts';

// The React twin of stories/Page.stories.svelte. A whole page from the static
// chrome (B1, B3, B4, B5), ilw-ui's styles only.
const meta = {
  title: 'Page Chrome/Page',
  parameters: { styles: 'ilw-ui', shell: false, layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const sections = ['CS 124', 'CS 128', 'CS 173', 'CS 225', 'CS 233', 'CS 341', 'CS 374', 'CS 421'];

function WholePage() {
  return (
    <Page
      format
      header={
        <header>
          <p style={{ margin: 0, padding: '1rem' }}>Site header (B2 comes later)</p>
        </header>
      }
      footer={<Footer siteName={<a href="#home">Sample Site</a>} />}
    >
      <Breadcrumbs
        items={[
          { label: 'Home', href: '#home' },
          { label: 'Academics', href: '#academics' },
        ]}
        current="Degree programs"
      />
      <PageTitle>Degree programs</PageTitle>
      <p>
        The page content, with <a href="#a-link">a link</a> to tab to after the skip link moves focus here.
      </p>
    </Page>
  );
}

/**
 * A whole page: skip link, header, breadcrumbs, page title, content and footer. No play function: the keyboard spec (`tests/e2e/page-chrome.spec.ts`) drives this one from a fresh load.
 *
 * **Why:** the fixture for the skip link and landmark checks, and a view of the static chrome together. axe scans it as a page.
 *
 * **Review:** press Tab: "Skip to main content" appears; Enter, then Tab again, reaches the breadcrumbs' first link.
 */
export const Fixture: Story = { name: 'Fixture', render: () => <WholePage /> };

/**
 * The same page with `html[data-theme="dark"]`.
 *
 * **Why:** the shell takes its colours from the theme, so the page turns dark; breadcrumbs follow; the page title and footer keep their brand plates, as upstream. axe checks the dark contrast.
 *
 * **Review:** a dark page with light text and light-blue links; the page title is light on dark; the footer bands are unchanged.
 */
export const Dark: Story = {
  name: 'Dark',
  globals: { theme: 'dark' },
  render: () => <WholePage />,
  play: plays.dark,
};

/**
 * The shell on its own, as an app that renders its own header and footer uses it: skip link, a plain `<header>`, `main`, a plain `<footer>`, and `backToTop`. No other ilw-ui component is on the page. No play function: the keyboard spec (`tests/e2e/page-chrome.spec.ts`) drives this one from a fresh load.
 *
 * **Why:** the fixture for the shell's whole keyboard path, `Page` and `BackToTop` alone: the skip link into `main`, through the content and the footer to back to top, and from there to the skip link again. axe scans it as a page.
 *
 * **Review:** press Tab: "Skip to main content" appears; Enter, then Tab, reaches "the staffing policy". Tab twice more to the round arrow at the bottom right; Enter scrolls to the top, and the next Tab shows the skip link again.
 */
export const ShellOnly: Story = {
  name: 'Shell only',
  render: () => (
    <Page
      format
      margin
      backToTop
      header={
        <header>
          <p style={{ margin: 0, padding: '1rem' }}>Course Staffing (the app&apos;s own header)</p>
        </header>
      }
      footer={
        <footer>
          <p style={{ margin: 0, padding: '1rem' }}>
            <a href="#contact">Contact the department</a>
          </p>
        </footer>
      }
    >
      <h1>Course staff</h1>
      <p>
        Teaching assistants for this term, by course. The app renders its own header and footer; ilw-ui supplies only the
        shell around them. See <a href="#staffing-policy">the staffing policy</a> for how assignments are made.
      </p>
      {sections.map((course) => (
        <Fragment key={course}>
          <h2>{course}</h2>
          <p>
            Two teaching assistants and one grader, with office hours on Tuesday and Thursday afternoons. Assignments are
            final once the department confirms them.
          </p>
        </Fragment>
      ))}
    </Page>
  ),
};
