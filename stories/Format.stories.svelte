<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, waitFor } from 'storybook/test';

  import type { ComboboxItem } from '../src/core/index.ts';
  import ComboboxDemo from './ComboboxDemo.svelte';
  import DataTableDemo from './DataTableDemo.svelte';
  import FormatSample from './parity/FormatSample.svelte';

  // No autodocs: the Light and Dark stories differ only by the theme global,
  // which a Docs page (one document) can't hold two values of.
  const { Story } = defineMeta({
    title: 'Format',
    component: FormatSample,
    parameters: { styles: 'ilw-ui' },
  });

  const people: ComboboxItem[] = [
    { value: 'aadams', label: 'Avery Adams', search: 'Avery Adams aadams' },
    { value: 'bbrown', label: 'Blake Brown', search: 'Blake Brown bbrown' },
    { value: 'dadams', label: 'Drew Adams', search: 'Drew Adams dadams' },
  ];

  const css = (el: Element, prop: string, pseudo?: string) => getComputedStyle(el, pseudo).getPropertyValue(prop);
  // WebKit rounds rem lengths to 1/64px (19.1875 for 19.2), so they compare as numbers.
  const px = (el: Element, prop: string) => parseFloat(css(el, prop));
  const one = (root: HTMLElement, selector: string) => root.querySelector<HTMLElement>(selector)!;
</script>

<!--
  The sample page with `.ilw-format`, ilw-ui's styles only, light.

  **Why:** checks the sizes, margins and colours `format.css` takes from the toolkit, and that colours come from the `--ilw-color--*` properties. axe checks contrast and the heading order.

  **Review:** same as **Parity/Format → IlwUi**: Montserrat h1, Source Sans everywhere else, Illinois Blue headings, Industrial links with an underline, a link icon after the Graduate College link.
-->
<Story
  name="Light"
  globals={{ theme: 'light' }}
  play={async ({ canvasElement }) => {
    await expect(document.querySelector('link[data-ilw-styles="toolkit"]')).toBeNull();
    const root = one(canvasElement, '.ilw-format');
    await expect(css(root, 'background-color')).toBe('rgb(255, 255, 255)');
    await expect(css(root, 'color')).toBe('rgb(37, 37, 37)');

    const h1 = one(root, 'h1');
    await expect(px(h1, 'font-size')).toBeCloseTo(40, 1);
    await expect(px(h1, 'line-height')).toBeCloseTo(46, 1);
    await expect(px(h1, 'margin-bottom')).toBeCloseTo(32, 1);
    await expect(css(h1, 'font-family')).toMatch(/Montserrat/);
    await expect(css(h1, 'color')).toBe('rgb(19, 41, 75)');
    await expect(px(one(root, 'h2'), 'font-size')).toBeCloseTo(35.008, 1);
    await expect(css(one(root, 'h2'), 'font-family')).toMatch(/Source Sans/);
    await expect(px(one(root, 'h3'), 'font-size')).toBeCloseTo(29.008, 1);
    await expect(px(one(root, 'h4'), 'font-size')).toBeCloseTo(25.008, 1);
    await expect(px(one(root, 'h5'), 'font-size')).toBeCloseTo(21.008, 1);
    await expect(px(one(root, 'h6'), 'font-size')).toBeCloseTo(18, 1);
    // .ilw-heading is an h4 that isn't a heading.
    const fake = one(root, 'p.ilw-heading');
    await expect(px(fake, 'font-size')).toBeCloseTo(25.008, 1);
    await expect(css(fake, 'font-weight')).toBe('700');

    const p = one(root, 'p');
    await expect(px(p, 'font-size')).toBeCloseTo(18, 1);
    await expect(px(p, 'margin-top')).toBeCloseTo(19.2, 1);
    await expect(px(one(root, 'li'), 'line-height')).toBeCloseTo(30.006, 1);
    await expect(px(one(root, 'ul'), 'margin-top')).toBeCloseTo(19.2, 1);

    const link = one(root, 'a[href="#format-requirements"]');
    await expect(css(link, 'color')).toBe('rgb(29, 88, 167)');
    await expect(css(link, 'text-decoration-line')).toBe('underline');
    await expect(css(one(root, 'h2 a'), 'color')).toBe('rgb(19, 41, 75)');
    const external = one(root, 'a[target="_blank"]');
    await expect(css(external, 'mask-image', '::after')).toMatch(/icons\/solid\/blue\/link\.svg/);
    await expect(css(external, 'width', '::after')).toBe('18px');
    await expect(css(link, 'mask-image', '::after')).toBe('none');

    link.focus();
    await expect(css(link, 'background-color')).toBe('rgb(199, 237, 248)');
    link.blur();

    await expect(css(one(root, 'hr'), 'border-top-color')).toBe('rgb(142, 144, 144)');
    await expect(px(one(root, 'blockquote'), 'margin-left')).toBeCloseTo(40, 1);
  }}
/>

<!--
  The same page with `html[data-theme="dark"]`, as the toolkit header's dark-mode toggle sets it.

  **Why:** `.ilw-format` paints the theme's background and text, so prose follows dark mode with no extra markup. axe checks the dark contrast.

  **Review:** near-black blue page, light text, pale blue headings and links. Tab to a link: dark blue focus background, light blue outline.
-->
<Story
  name="Dark"
  globals={{ theme: 'dark' }}
  play={async ({ canvasElement }) => {
    const root = one(canvasElement, '.ilw-format');
    await expect(css(root, 'background-color')).toBe('rgb(17, 24, 29)');
    await expect(css(root, 'color')).toBe('rgb(244, 244, 244)');
    await expect(css(one(root, 'p'), 'color')).toBe('rgb(244, 244, 244)');
    await expect(css(one(root, 'h1'), 'color')).toBe('rgb(225, 231, 241)');
    await expect(css(one(root, 'a[href="#format-requirements"]'), 'color')).toBe('rgb(202, 217, 239)');
  }}
/>

<!--
  The sample with `theme="blue"` on the `.ilw-format` element.

  **Why:** a theme only sets properties; `.ilw-format` is what paints them. axe checks white-on-blue contrast.

  **Review:** Illinois Blue background, white text, headings and links.
-->
<Story
  name="Blue theme"
  args={{ theme: 'blue' }}
  play={async ({ canvasElement }) => {
    const root = one(canvasElement, '.ilw-format');
    await expect(css(root, 'background-color')).toBe('rgb(19, 41, 75)');
    await expect(css(one(root, 'h1'), 'color')).toBe('rgb(255, 255, 255)');
    await expect(css(one(root, 'a[href="#format-requirements"]'), 'color')).toBe('rgb(255, 255, 255)');
  }}
/>

<!--
  A `Combobox` (open) and a paged `DataTable` inside `.ilw-format` prose.

  **Why:** every `format.css` rule has zero specificity, so a component's own classed rules win: the combobox keeps its 16px field and options, the sort buttons and pager keep theirs. Prose around them is still formatted.

  **Review:** the paragraphs are 18px Source Sans; the combobox field, its open list and the pager look exactly as in their own stories (16px). The table has its own table styles.
-->
<Story
  name="Components inside"
  play={async ({ canvas, canvasElement, userEvent }) => {
    const root = one(canvasElement, '.ilw-format');
    await expect(px(one(root, '.intro'), 'font-size')).toBeCloseTo(18, 1);

    const input = canvas.getByRole('combobox', { name: 'Person' });
    await expect(px(input, 'font-size')).toBeCloseTo(16, 1);
    await expect(px(input, 'padding-top')).toBeCloseTo(10, 1);
    await expect(px(input, 'width')).toBeCloseTo(200, 1);
    await userEvent.click(input);
    await userEvent.keyboard('ad');
    await waitFor(() => expect(input).toHaveAttribute('aria-expanded', 'true'));
    const option = canvas.getAllByRole('option')[0];
    await expect(px(option, 'font-size')).toBeCloseTo(16, 1);
    await expect(px(option, 'line-height')).toBeCloseTo(20, 1);
    await expect(css(option, 'color')).toBe('rgb(37, 37, 37)');

    const sort = one(root, '.th-sort');
    await expect(css(sort, 'font-weight')).toBe('700');
    // The sort button inherits its heading cell's size from the table styles, not from .ilw-format.
    await expect(css(sort, 'font-size')).toBe(css(sort.closest('th')!, 'font-size'));
    const page = one(root, '.ilw-pager-btn:not(:disabled)');
    await expect(px(page, 'font-size')).toBeCloseTo(16, 1);
    await expect(css(page, 'border-top-color')).toBe('rgb(19, 41, 75)');
  }}
>
  {#snippet template()}
    <div class="ilw-format">
      <h1>Assignments</h1>
      <p class="intro">Choose a person, then review the roster below.</p>
      <ComboboxDemo items={people} placeholder="Select a person" />
      <h2>Roster</h2>
      <DataTableDemo count={8} pageSize={3} />
    </div>
  {/snippet}
</Story>
