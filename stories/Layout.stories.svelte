<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import { Breadcrumbs, Columns, Content, Grid, Page, PageTitle, Spacer } from '../src/svelte/index.ts';
  import * as plays from './plays/layout.ts';
  import { modes } from './plays/layout.ts';

  import './Layout.stories.css';

  // A5: content, columns, grid, spacer and the width classes, ilw-ui's styles only.
  const { Story } = defineMeta({ title: 'Layout', parameters: { styles: 'ilw-ui' } });

  const trail = [{ label: 'Home', href: '#home' }];
</script>

<!--
  `Content` without a mode, in the gray and blue themes, centred, and transparent.

  **Why:** the play function checks the markup (`.ilw-content.ilw-format` around `.ilw-content-inner`), the theme attribute's colours, the alignment, and that transparent drops the background. axe checks each theme's contrast.

  **Review:** prose in the toolkit's type; the gray box is Storm 95, the blue one white on Illinois Blue; the centred box's list markers sit inside.
-->
<Story
  name="Content"
  play={plays.content}
>
  <Content theme="gray">
    <h2>Programs</h2>
    <p>The college offers <a href="#programs">programs of study</a> in three areas.</p>
  </Content>
  <Content theme="blue">
    <h2>On blue</h2>
    <p>Links <a href="#blue">take the theme's colours</a>.</p>
  </Content>
  <Content align="center">
    <h2>Centred</h2>
    <ul><li>Virtual reality</li><li>Machine learning</li></ul>
  </Content>
  <Content transparent>
    <p>A transparent box shows the page behind it.</p>
  </Content>
</Story>

<!--
  `Content` in the introduction, lede and inset modes, with the lede's decoration on each side.

  **Why:** the play function checks each mode's text size, the narrow centred column, the decoration bar's side (and the centred lede's rule), and the inset's padding.

  **Review:** the introduction and ledes are a narrower centred column of larger text, the ledes italic; the bar is orange on the side the text starts; the centred lede has a short rule underneath; the inset has smaller headings and wide padding.
-->
<Story
  name="Content Modes"
  play={plays.contentModes}
>
  <Content mode="introduction">
    <p><em>Discover your path, define your future.</em></p>
    <p>No matter what path brought you here, we're glad you're here.</p>
  </Content>
  <Content mode="lede" decoration>
    <p>Sodium is an essential micronutrient, but the amount we need is small.</p>
  </Content>
  <Content mode="lede" decoration align="right">
    <p>A right-aligned lede has its bar on the right.</p>
  </Content>
  <Content mode="lede" decoration align="center">
    <p>A centred lede has a short rule underneath.</p>
  </Content>
  <Content mode="inset" theme="gray">
    <h2>Apply today</h2>
    <p>An inset normalises its headings for a call to action.</p>
  </Content>
</Story>

<!--
  `Columns` in every mode, and reversed.

  **Why:** the play function checks each mode's class and its columns' flex weights, the sidebar's fixed width, the reverse modifier, and the gap. Below 700 px (the test browser, a phone) they stack; above, they sit side by side.

  **Review:** widen the window past 700 px: each row splits as its label says; the sidebars are 280 px; the reversed row reads right to left. Narrow it: every row stacks in DOM order.
-->
<Story
  name="Columns"
  play={plays.columns}
>
  {#each modes as mode (mode)}
    <h3>{mode}</h3>
    <Columns {mode}>
      {#each mode === '1x1' || mode === '1x2x1' ? [1, 2, 3, 4].slice(0, mode === '1x1' ? 3 : 4) : [1, 2] as n (n)}
        <div class="layout-sample">Column {n}</div>
      {/each}
    </Columns>
  {/each}
  <h3>1x1, reversed</h3>
  <Columns reverse>
    <div class="layout-sample">First in the DOM</div>
    <div class="layout-sample">Second in the DOM</div>
  </Columns>
</Story>

<!--
  `Columns` inside a 600 px and a 900 px `.ilw-container`, and on a blue theme.

  **Why:** the columns stack by container query: in a container narrower than 700 px they stack, whatever the window. The play function checks the narrow one stacks and the themed row paints its background.

  **Review:** the first row is stacked at any window width; the second sits side by side once the window is wider than 700 px.
-->
<Story
  name="Columns In A Container"
  play={plays.columnsInAContainer}
>
  <div class="ilw-container" style:max-width="600px">
    <Columns>
      <div class="layout-sample">In 600 px</div>
      <div class="layout-sample">Stacked</div>
    </Columns>
  </div>
  <div class="ilw-container" style:max-width="900px">
    <Columns>
      <div class="layout-sample">In 900 px</div>
      <div class="layout-sample">Side by side on a wide window</div>
    </Columns>
  </div>
  <Columns theme="blue" gap="40px">
    <div><p>White on Illinois Blue, with a 40 px gap.</p></div>
    <div><p>The theme is a `theme` attribute.</p></div>
  </Columns>
</Story>

<!--
  `Grid` of eight items at least 120 px wide, and a `div` grid with a gap of 20 px.

  **Why:** the play function checks the list markup and that the column count is as many 120 px tracks as fit the grid's width, and the gap.

  **Review:** resize the window: items reflow, every row's items the height of its tallest.
-->
<Story
  name="Grid"
  play={plays.grid}
>
  <Grid itemWidth="120px">
    {#each [1, 2, 3, 4, 5, 6, 7, 8] as n (n)}
      <li><div class="layout-sample">Item {n}{n === 3 ? ', with more text that wraps onto a second line' : ''}</div></li>
    {/each}
  </Grid>
  <Spacer />
  <Grid as="div" gap="20px">
    <div class="layout-sample">A</div>
    <div class="layout-sample">B</div>
  </Grid>
</Story>

<!--
  `Spacer` at the default 20 px and at 3 rem.

  **Why:** the play function checks the heights and that the spacer is hidden from assistive technology.

  **Review:** two gaps between the paragraphs, the second larger.
-->
<Story
  name="Spacer"
  play={plays.spacer}
>
  <p style:margin="0">Above</p>
  <Spacer />
  <p style:margin="0">Between</p>
  <Spacer height="3rem" />
  <p style:margin="0">Below</p>
</Story>

<!--
  The widths inside `Page margin` (side margins on `main`): content, columns, breadcrumbs and the page title at `full` and `auto`.

  **Why:** the play function measures the breakouts: a `full` or `auto` box spans the page exactly, `auto` puts its content back at the side margin, and the page never scrolls sideways.

  **Review:** the full boxes touch both edges of the window; the auto boxes too, with their text lined up with the paragraphs; widen the window past 1200 px and the margins grow to keep 1140 px of content.
-->
<Story
  name="Widths"
  parameters={{ shell: false, layout: 'fullscreen' }}
  play={plays.widths}
>
  <Page format margin>
    <p>A paragraph at the side margin, for comparison.</p>
    <Breadcrumbs items={trail} current="Full" width="full" />
    <Breadcrumbs items={trail} current="Auto" width="auto" />
    <PageTitle width="full">Full page title</PageTitle>
    <Spacer />
    <PageTitle width="auto">Auto page title</PageTitle>
    <Content theme="gray" width="full"><p>Full content: the text goes to the edge.</p></Content>
    <Content theme="blue" width="auto"><p>Auto content: the background goes to the edge, the text keeps the margin.</p></Content>
    <Columns theme="gray" width="auto">
      <div><p>Auto columns</p></div>
      <div><p>keep the margin</p></div>
    </Columns>
  </Page>
</Story>

<!--
  `width="page"` inside `Page` without side margins: breadcrumbs, content and grid keep to the page margin; the page title's `page` spans the page with its text at the margin, as the toolkit's does.

  **Why:** the play function checks each `page` box starts at the side margin, and the page title renders `ilw-width-auto`.

  **Review:** everything lines up at the left margin; the page title's plate is edge to edge with the text at the margin.
-->
<Story
  name="Page Width"
  parameters={{ shell: false, layout: 'fullscreen' }}
  play={plays.pageWidth}
>
  <Page format>
    <Breadcrumbs items={trail} current="Page" width="page" />
    <PageTitle width="page">Page title, width page</PageTitle>
    <Content width="page"><p>Content at the page margin.</p></Content>
    <Grid width="page" itemWidth="120px">
      <li><div class="layout-sample">Grid</div></li>
      <li><div class="layout-sample">at the margin</div></li>
    </Grid>
  </Page>
</Story>
