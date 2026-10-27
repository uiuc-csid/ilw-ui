<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';

  import { Breadcrumbs, Columns, type ColumnsMode, Content, Grid, Page, PageTitle, Spacer } from '../src/svelte/index.ts';

  // A5: content, columns, grid, spacer and the width classes, ilw-ui's styles only.
  const { Story } = defineMeta({ title: 'Layout', parameters: { styles: 'ilw-ui' } });

  const modes: ColumnsMode[] = ['1x1', '1x2', '2x1', '1x3', '3x1', '1x2x1', 'sidebar-left', 'sidebar-right'];

  const grow = (el: Element) => Number(getComputedStyle(el).flexGrow);
  const px = (v: string) => parseFloat(v);
  /** The toolkit's side margin, max(1.875rem, 50cqw - 35.625rem), for a container this wide. */
  const side = (width: number) => Math.max(30, width / 2 - 570);
  const trail = [{ label: 'Home', href: '#home' }];
</script>

<!--
  `Content` without a mode, in the gray and blue themes, centred, and transparent.

  **Why:** the play function checks the markup (`.ilw-content.ilw-format` around `.ilw-content-inner`), the theme attribute's colours, the alignment, and that transparent drops the background. axe checks each theme's contrast.

  **Review:** prose in the toolkit's type; the gray box is Storm 95, the blue one white on Illinois Blue; the centred box's list markers sit inside.
-->
<Story
  name="Content"
  play={async ({ canvasElement }) => {
    const boxes = canvasElement.querySelectorAll<HTMLElement>('.ilw-content');
    await expect(boxes).toHaveLength(4);
    for (const box of boxes) {
      await expect(box).toHaveClass('ilw-format');
      await expect(box.firstElementChild).toHaveClass('ilw-content-inner');
    }
    await expect(boxes[0]).toHaveAttribute('theme', 'gray');
    await expect(getComputedStyle(boxes[0]).backgroundColor).toBe('rgb(244, 244, 244)');
    await expect(getComputedStyle(boxes[1]).backgroundColor).toBe('rgb(19, 41, 75)');
    await expect(getComputedStyle(boxes[1]).color).toBe('rgb(255, 255, 255)');
    await expect(getComputedStyle(boxes[2].firstElementChild!).textAlign).toBe('center');
    await expect(getComputedStyle(boxes[2].querySelector('ul')!).listStylePosition).toBe('inside');
    await expect(boxes[3]).not.toHaveAttribute('theme');
    await expect(getComputedStyle(boxes[3]).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  }}
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
  play={async ({ canvasElement }) => {
    const [intro, lede, right, center, inset] = canvasElement.querySelectorAll<HTMLElement>('.ilw-content');
    await expect(intro).toHaveClass('ilw-content--introduction');
    await expect(getComputedStyle(intro.querySelector('p')!).fontSize).toBe('22px');
    await expect(getComputedStyle(intro.querySelector('em')!).fontSize).toBe('36px');
    await expect(getComputedStyle(intro.firstElementChild!).maxWidth).toBe('1060px');
    await expect(getComputedStyle(lede.querySelector('p')!).fontStyle).toBe('italic');
    const bar = getComputedStyle(lede.firstElementChild!);
    await expect(bar.borderLeftWidth).toBe('6px');
    await expect(bar.borderLeftColor).toBe('rgb(255, 95, 5)');
    await expect(getComputedStyle(right.firstElementChild!).borderRightWidth).toBe('6px');
    await expect(getComputedStyle(right.firstElementChild!).borderLeftWidth).toBe('0px');
    await expect(getComputedStyle(center.firstElementChild!).borderLeftWidth).toBe('0px');
    await expect(getComputedStyle(center.firstElementChild!, '::after').borderBottomWidth).toBe('6px');
    await expect(px(getComputedStyle(inset.querySelector('h2')!).fontSize)).toBeCloseTo(29.008, 2);
    await expect(px(getComputedStyle(inset.firstElementChild!).paddingTop)).toBeGreaterThan(0);
  }}
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
  play={async ({ canvasElement }) => {
    const rows = [...canvasElement.querySelectorAll<HTMLElement>('.ilw-columns')];
    await expect(rows).toHaveLength(modes.length + 1);
    const weights = rows.map((r) => [...r.children].map(grow).join(' '));
    await expect(weights).toEqual(['1 1 1', '1 2', '2 1', '1 3', '3 1', '1 2 2 1', '0 1', '1 0', '1 1']);
    await expect(rows[1]).toHaveClass('ilw-1x2');
    await expect(rows[6]).toHaveClass('ilw-columns--sidebar-left');
    await expect(rows[8]).toHaveClass('ilw-columns--reverse');
    await expect(getComputedStyle(rows[0]).columnGap).toBe('20px');
    await expect(getComputedStyle(rows[6]).columnGap).toBe('30px');
    const stacked = window.innerWidth <= 700;
    await expect(getComputedStyle(rows[0]).flexDirection).toBe(stacked ? 'column' : 'row');
    await expect(getComputedStyle(rows[8]).flexDirection).toBe(stacked ? 'column' : 'row-reverse');
    if (!stacked) await expect(rows[6].firstElementChild!.getBoundingClientRect().width).toBe(280);
  }}
>
  {#each modes as mode (mode)}
    <h3>{mode}</h3>
    <Columns {mode}>
      {#each mode === '1x1' || mode === '1x2x1' ? [1, 2, 3, 4].slice(0, mode === '1x1' ? 3 : 4) : [1, 2] as n (n)}
        <div class="sample">Column {n}</div>
      {/each}
    </Columns>
  {/each}
  <h3>1x1, reversed</h3>
  <Columns reverse>
    <div class="sample">First in the DOM</div>
    <div class="sample">Second in the DOM</div>
  </Columns>
</Story>

<!--
  `Columns` inside a 600 px and a 900 px `.ilw-container`, and on a blue theme.

  **Why:** the columns stack by container query: in a container narrower than 700 px they stack, whatever the window. The play function checks the narrow one stacks and the themed row paints its background.

  **Review:** the first row is stacked at any window width; the second sits side by side once the window is wider than 700 px.
-->
<Story
  name="Columns In A Container"
  play={async ({ canvasElement }) => {
    const [narrow, wide, themed] = canvasElement.querySelectorAll<HTMLElement>('.ilw-columns');
    await expect(getComputedStyle(narrow.parentElement!).containerType).toBe('inline-size');
    await expect(getComputedStyle(narrow).flexDirection).toBe('column');
    await expect(getComputedStyle(wide).flexDirection).toBe(window.innerWidth <= 700 ? 'column' : 'row');
    await expect(getComputedStyle(themed).backgroundColor).toBe('rgb(19, 41, 75)');
    await expect(getComputedStyle(themed).columnGap).toBe('40px');
  }}
>
  <div class="ilw-container" style:max-width="600px">
    <Columns>
      <div class="sample">In 600 px</div>
      <div class="sample">Stacked</div>
    </Columns>
  </div>
  <div class="ilw-container" style:max-width="900px">
    <Columns>
      <div class="sample">In 900 px</div>
      <div class="sample">Side by side on a wide window</div>
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
  play={async ({ canvasElement }) => {
    const [list, div] = canvasElement.querySelectorAll<HTMLElement>('.ilw-grid');
    await expect(list.tagName).toBe('UL');
    await expect(list.querySelectorAll(':scope > li')).toHaveLength(8);
    await expect(getComputedStyle(list).listStyleType).toBe('none');
    const width = list.getBoundingClientRect().width;
    // auto-fit collapses the empty tracks; WebKit still lists them, as 0px.
    const tracks = getComputedStyle(list).gridTemplateColumns.split(' ').filter((t) => t !== '0px').length;
    await expect(tracks).toBe(Math.min(8, Math.floor((width + 10) / 130)));
    await expect(div.tagName).toBe('DIV');
    await expect(getComputedStyle(div).columnGap).toBe('20px');
  }}
>
  <Grid itemWidth="120px">
    {#each [1, 2, 3, 4, 5, 6, 7, 8] as n (n)}
      <li><div class="sample">Item {n}{n === 3 ? ', with more text that wraps onto a second line' : ''}</div></li>
    {/each}
  </Grid>
  <Spacer />
  <Grid as="div" gap="20px">
    <div class="sample">A</div>
    <div class="sample">B</div>
  </Grid>
</Story>

<!--
  `Spacer` at the default 20 px and at 3 rem.

  **Why:** the play function checks the heights and that the spacer is hidden from assistive technology.

  **Review:** two gaps between the paragraphs, the second larger.
-->
<Story
  name="Spacer"
  play={async ({ canvasElement }) => {
    const [a, b] = canvasElement.querySelectorAll<HTMLElement>('.ilw-spacer');
    await expect(a).toHaveAttribute('aria-hidden', 'true');
    await expect(a.getBoundingClientRect().height).toBe(20);
    await expect(b.getBoundingClientRect().height).toBe(48);
  }}
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
  play={async ({ canvasElement }) => {
    const page = canvasElement.querySelector<HTMLElement>('.ilw-page')!;
    await expect(getComputedStyle(page).containerType).toBe('inline-size');
    const pageBox = page.getBoundingClientRect();
    const margin = side(page.clientWidth);
    for (const el of canvasElement.querySelectorAll<HTMLElement>('.ilw-width-full, .ilw-width-auto')) {
      const box = el.getBoundingClientRect();
      await expect(box.left, el.className).toBeCloseTo(pageBox.left, 0);
      await expect(box.width, el.className).toBeCloseTo(page.clientWidth, 0);
    }
    for (const el of canvasElement.querySelectorAll<HTMLElement>(':is(.ilw-content, .ilw-columns, .ilw-breadcrumbs).ilw-width-auto')) {
      await expect(px(getComputedStyle(el).paddingLeft), el.className).toBeCloseTo(margin, 0);
    }
    const autoTitle = canvasElement.querySelector('.ilw-page-title.ilw-width-auto .ilw-page-title-text')!;
    await expect(autoTitle.getBoundingClientRect().left - pageBox.left).toBeCloseTo(margin, 0);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
  }}
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
  play={async ({ canvasElement }) => {
    const page = canvasElement.querySelector<HTMLElement>('.ilw-page')!;
    const left = page.getBoundingClientRect().left;
    const margin = side(page.clientWidth);
    const boxes = canvasElement.querySelectorAll<HTMLElement>('.ilw-width-page');
    await expect(boxes).toHaveLength(3);
    for (const el of boxes) await expect(el.getBoundingClientRect().left - left, el.className).toBeCloseTo(margin, 0);
    const title = canvasElement.querySelector('.ilw-page-title')!;
    await expect(title).toHaveClass('ilw-width-auto');
  }}
>
  <Page format>
    <Breadcrumbs items={trail} current="Page" width="page" />
    <PageTitle width="page">Page title, width page</PageTitle>
    <Content width="page"><p>Content at the page margin.</p></Content>
    <Grid width="page" itemWidth="120px">
      <li><div class="sample">Grid</div></li>
      <li><div class="sample">at the margin</div></li>
    </Grid>
  </Page>
</Story>

<style>
  .sample {
    box-sizing: border-box;
    height: 100%;
    padding: 0.75rem;
    border: 1px solid var(--ilw-color--border, currentcolor);
    background: var(--ilw-color--background);
    color: var(--ilw-color--text);
  }
</style>
