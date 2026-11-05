import type { Meta, StoryObj } from '@storybook/react-vite';

import { Columns, Content, Grid, Spacer } from '../../../src/react/index.ts';
import * as plays from '../../plays/layout.ts';
import { parityItems as items } from '../../plays/layout.ts';

import '../../parity/Layout.parity.stories.css';

// The React twin of stories/parity/Layout.parity.stories.svelte: its IlwUi
// side. No autodocs, as there.
const meta = { title: 'Parity/Layout' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `Content`, `Columns`, `Grid` and `Spacer` with the same variants, styled by ilw-ui only.
 *
 * **Why:** the play function checks the markup each renders (classes, the theme attribute, the grid's list). The details are tested in **Layout**.
 *
 * **Review:** matches **Toolkit**: the same type, colours, decoration bar, column split, 280 px sidebar and grid.
 */
export const IlwUi: Story = {
  name: 'IlwUi',
  parameters: { styles: 'ilw-ui' },
  render: () => (
    <>
      <Content theme="gray">
        <h2>Programs</h2>
        <p>
          The college offers <a href="#programs">programs of study</a>.
        </p>
      </Content>
      <Content mode="introduction">
        <p>
          <em>Discover your path.</em>
        </p>
        <p>No matter what path brought you here, we&apos;re glad you&apos;re here.</p>
      </Content>
      <Content mode="lede" decoration>
        <p>Sodium is an essential micronutrient, but the amount we need is small.</p>
      </Content>
      <Content mode="inset" theme="blue">
        <h2>Apply today</h2>
        <p>An inset normalises its headings.</p>
      </Content>
      <Spacer height="30px" />
      <Columns mode="2x1">
        <div className="layout-parity-sample">Two thirds</div>
        <div className="layout-parity-sample">One third</div>
      </Columns>
      <Spacer />
      <Columns mode="sidebar-left" theme="blue">
        <div>
          <p>Sidebar</p>
        </div>
        <div>
          <p>Main column, white on Illinois Blue</p>
        </div>
      </Columns>
      <Spacer />
      <Grid itemWidth="180px">
        {items.map((n) => (
          <li key={n}>
            <div className="layout-parity-sample">Item {n}</div>
          </li>
        ))}
      </Grid>
    </>
  ),
  play: plays.parity,
};
