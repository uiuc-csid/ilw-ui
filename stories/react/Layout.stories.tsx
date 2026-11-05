import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fragment } from 'react';

// A namespace import: the story exports are the components' names.
import * as ilw from '../../src/react/index.ts';
import * as plays from '../plays/layout.ts';
import { modes } from '../plays/layout.ts';

import '../Layout.stories.css';

// The React twin of stories/Layout.stories.svelte. A5: content, columns, grid,
// spacer and the width classes, ilw-ui's styles only. Widths and Page Width
// render Breadcrumbs and PageTitle (R1 page chrome), so they wait in
// tests/twins-pending/LayoutWidths.txt.
const meta = { title: 'Layout', parameters: { styles: 'ilw-ui' } } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `Content` without a mode, in the gray and blue themes, centred, and transparent.
 *
 * **Why:** the play function checks the markup (`.ilw-content.ilw-format` around `.ilw-content-inner`), the theme attribute's colours, the alignment, and that transparent drops the background. axe checks each theme's contrast.
 *
 * **Review:** prose in the toolkit's type; the gray box is Storm 95, the blue one white on Illinois Blue; the centred box's list markers sit inside.
 */
export const Content: Story = {
  name: 'Content',
  render: () => (
    <>
      <ilw.Content theme="gray">
        <h2>Programs</h2>
        <p>
          The college offers <a href="#programs">programs of study</a> in three areas.
        </p>
      </ilw.Content>
      <ilw.Content theme="blue">
        <h2>On blue</h2>
        <p>
          Links <a href="#blue">take the theme&apos;s colours</a>.
        </p>
      </ilw.Content>
      <ilw.Content align="center">
        <h2>Centred</h2>
        <ul>
          <li>Virtual reality</li>
          <li>Machine learning</li>
        </ul>
      </ilw.Content>
      <ilw.Content transparent>
        <p>A transparent box shows the page behind it.</p>
      </ilw.Content>
    </>
  ),
  play: plays.content,
};

/**
 * `Content` in the introduction, lede and inset modes, with the lede's decoration on each side.
 *
 * **Why:** the play function checks each mode's text size, the narrow centred column, the decoration bar's side (and the centred lede's rule), and the inset's padding.
 *
 * **Review:** the introduction and ledes are a narrower centred column of larger text, the ledes italic; the bar is orange on the side the text starts; the centred lede has a short rule underneath; the inset has smaller headings and wide padding.
 */
export const ContentModes: Story = {
  name: 'Content Modes',
  render: () => (
    <>
      <ilw.Content mode="introduction">
        <p>
          <em>Discover your path, define your future.</em>
        </p>
        <p>No matter what path brought you here, we&apos;re glad you&apos;re here.</p>
      </ilw.Content>
      <ilw.Content mode="lede" decoration>
        <p>Sodium is an essential micronutrient, but the amount we need is small.</p>
      </ilw.Content>
      <ilw.Content mode="lede" decoration align="right">
        <p>A right-aligned lede has its bar on the right.</p>
      </ilw.Content>
      <ilw.Content mode="lede" decoration align="center">
        <p>A centred lede has a short rule underneath.</p>
      </ilw.Content>
      <ilw.Content mode="inset" theme="gray">
        <h2>Apply today</h2>
        <p>An inset normalises its headings for a call to action.</p>
      </ilw.Content>
    </>
  ),
  play: plays.contentModes,
};

/** How many sample columns each mode's row gets. */
const columnsOf = (mode: (typeof modes)[number]) => (mode === '1x1' ? [1, 2, 3] : mode === '1x2x1' ? [1, 2, 3, 4] : [1, 2]);

/**
 * `Columns` in every mode, and reversed.
 *
 * **Why:** the play function checks each mode's class and its columns' flex weights, the sidebar's fixed width, the reverse modifier, and the gap. Below 700 px (the test browser, a phone) they stack; above, they sit side by side.
 *
 * **Review:** widen the window past 700 px: each row splits as its label says; the sidebars are 280 px; the reversed row reads right to left. Narrow it: every row stacks in DOM order.
 */
export const Columns: Story = {
  name: 'Columns',
  render: () => (
    <>
      {modes.map((mode) => (
        <Fragment key={mode}>
          <h3>{mode}</h3>
          <ilw.Columns mode={mode}>
            {columnsOf(mode).map((n) => (
              <div key={n} className="layout-sample">
                Column {n}
              </div>
            ))}
          </ilw.Columns>
        </Fragment>
      ))}
      <h3>1x1, reversed</h3>
      <ilw.Columns reverse>
        <div className="layout-sample">First in the DOM</div>
        <div className="layout-sample">Second in the DOM</div>
      </ilw.Columns>
    </>
  ),
  play: plays.columns,
};

/**
 * `Columns` inside a 600 px and a 900 px `.ilw-container`, and on a blue theme.
 *
 * **Why:** the columns stack by container query: in a container narrower than 700 px they stack, whatever the window. The play function checks the narrow one stacks and the themed row paints its background.
 *
 * **Review:** the first row is stacked at any window width; the second sits side by side once the window is wider than 700 px.
 */
export const ColumnsInAContainer: Story = {
  name: 'Columns In A Container',
  render: () => (
    <>
      <div className="ilw-container" style={{ maxWidth: '600px' }}>
        <ilw.Columns>
          <div className="layout-sample">In 600 px</div>
          <div className="layout-sample">Stacked</div>
        </ilw.Columns>
      </div>
      <div className="ilw-container" style={{ maxWidth: '900px' }}>
        <ilw.Columns>
          <div className="layout-sample">In 900 px</div>
          <div className="layout-sample">Side by side on a wide window</div>
        </ilw.Columns>
      </div>
      <ilw.Columns theme="blue" gap="40px">
        <div>
          <p>White on Illinois Blue, with a 40 px gap.</p>
        </div>
        <div>
          <p>The theme is a `theme` attribute.</p>
        </div>
      </ilw.Columns>
    </>
  ),
  play: plays.columnsInAContainer,
};

/**
 * `Grid` of eight items at least 120 px wide, and a `div` grid with a gap of 20 px.
 *
 * **Why:** the play function checks the list markup and that the column count is as many 120 px tracks as fit the grid's width, and the gap.
 *
 * **Review:** resize the window: items reflow, every row's items the height of its tallest.
 */
export const Grid: Story = {
  name: 'Grid',
  render: () => (
    <>
      <ilw.Grid itemWidth="120px">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <li key={n}>
            <div className="layout-sample">
              Item {n}
              {n === 3 ? ', with more text that wraps onto a second line' : ''}
            </div>
          </li>
        ))}
      </ilw.Grid>
      <ilw.Spacer />
      <ilw.Grid as="div" gap="20px">
        <div className="layout-sample">A</div>
        <div className="layout-sample">B</div>
      </ilw.Grid>
    </>
  ),
  play: plays.grid,
};

/**
 * `Spacer` at the default 20 px and at 3 rem.
 *
 * **Why:** the play function checks the heights and that the spacer is hidden from assistive technology.
 *
 * **Review:** two gaps between the paragraphs, the second larger.
 */
export const Spacer: Story = {
  name: 'Spacer',
  render: () => (
    <>
      <p style={{ margin: '0' }}>Above</p>
      <ilw.Spacer />
      <p style={{ margin: '0' }}>Between</p>
      <ilw.Spacer height="3rem" />
      <p style={{ margin: '0' }}>Below</p>
    </>
  ),
  play: plays.spacer,
};
