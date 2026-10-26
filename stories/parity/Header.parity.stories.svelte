<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';

  import IlwUiHeader from './IlwUiHeader.svelte';
  import SideBySide from './SideBySide.svelte';
  import ToolkitHeader from './ToolkitHeader.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets. A header is page-level (a
  // banner landmark), so neither side goes inside the Storybook <main>.
  // `mega` switches both sides between the disclosure menu and the megamenu.
  const { Story } = defineMeta({
    title: 'Parity/Header',
    parameters: { shell: false, layout: 'fullscreen' },
    args: { mega: false },
    argTypes: { mega: { control: 'boolean' } },
  });
</script>

<!--
  `<ilw-header>` with `<ilw-header-menu>` (or, with `mega`, `<ilw-header-megamenu>`), styled and scripted by the vendored toolkit only.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** compare with **IlwUi** or **Side By Side**, at 1280 px and under 990 px (the toolkit switches to its "Menu" button there).
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }}>
  {#snippet template(args)}
    <ToolkitHeader mega={args.mega} />
  {/snippet}
</Story>

<!--
  `Header` with the same content, styled by ilw-ui's `header.css` only, with no script.

  **Why:** the play function checks the toolkit's type and colours: the orange top rule, the blue block I, the parent unit and site name sizes, and the search field's border.

  **Review:** matches **Toolkit** at 1280 px: wordmark, utility links top right, search under them, the grey bar of nav items with the same widths; open "Information" and the megamenu's "Admissions" to compare the dropdowns. Under 990 px both show a "MENU" button (an icon only under 600 px) that opens the same panel.
-->
<Story
  name="IlwUi"
  parameters={{ styles: 'ilw-ui' }}
  play={async ({ canvasElement }) => {
    const header = canvasElement.querySelector<HTMLElement>('.ilw-header')!;
    const style = (sel: string) => getComputedStyle(header.querySelector(sel)!);
    await expect(getComputedStyle(header).borderTop).toBe('8px solid rgb(255, 95, 5)');
    await expect(getComputedStyle(header).backgroundColor).toBe('rgb(255, 255, 255)');
    await expect(style('.ilw-header-block-i').backgroundColor).toBe('rgb(19, 41, 75)');
    await expect(style('.ilw-header-block-i').height).toBe('51px');
    await expect(style('.ilw-header-parent-unit').fontSize).toBe('18px');
    await expect(style('.ilw-header-site-name').font).toMatch(/^700 24px \/ 30px "?Source Sans/);
    await expect(style('.ilw-header-site-name').color).toBe('rgb(19, 41, 75)');
    await expect(style('.ilw-header-search input').borderTop).toBe('2px solid rgb(112, 115, 114)');
    await expect(style('.ilw-header-search input').height).toBe('36px');
  }}
>
  {#snippet template(args)}
    <IlwUiHeader mega={args.mega} />
  {/snippet}
</Story>

<!--
  Both sides, each in its own iframe: the disclosure menu, then the megamenu.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same header on both sides. Each frame is narrower than 990 px in this layout, so both show "MENU"; open each side's menu to compare. Under the Dark toolbar setting the ilw-ui side turns dark; the toolkit's header has no dark styles.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', shell: true, a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide
      pair="parity-header"
      theme={String(context.globals.theme ?? 'light')}
      height={560}
      rows={[
        { label: 'Menu', args: { mega: '!false' } },
        { label: 'Megamenu', args: { mega: '!true' } },
      ]}
    />
  {/snippet}
</Story>
