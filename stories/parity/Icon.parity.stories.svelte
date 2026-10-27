<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Calendar from 'phosphor-svelte/lib/Calendar';
  import Envelope from 'phosphor-svelte/lib/Envelope';
  import { expect } from 'storybook/test';

  import Icon from '../../src/svelte/Icon.svelte';
  import { toolkitIcons } from './icons.ts';
  import SideBySide from './SideBySide.svelte';

  import './Icon.parity.stories.css';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/Icon' });
</script>

<!--
  `<ilw-icon>`: every icon in the toolkit's font, solid then `type="line"`, then a labelled icon and an `.ilw-icon-row`, styled by the vendored toolkit only.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** compare with **IlwUi** or **Side By Side**.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }}>
  <ul class="icon-grid">
    {#each toolkitIcons as [name] (name)}
      <li><ilw-icon icon={name}></ilw-icon><ilw-icon icon={name} type="line"></ilw-icon> {name}</li>
    {/each}
  </ul>
  <p>Next session: <ilw-icon icon="calendar" alt="Calendar" size="2rem"></ilw-icon></p>
  <div class="ilw-icon-row">
    <ilw-icon icon="email" size="18px"></ilw-icon>
    <p>Email the department office.</p>
  </div>
</Story>

<!--
  `Icon` with the Phosphor icon that replaces each toolkit name, solid (fill) then line (regular), then a labelled icon and an `.ilw-icon-row`, styled by ilw-ui's `styles.css` only, inside the `.ilw-format` shell as on the toolkit side.

  **Why:** the play function checks the contract: decorative icons are hidden from assistive technology, a labelled one is an image with that name, the size follows the font or the `size` prop, the colour is the text's, and the text is in the brand font. axe checks the rest. The grid is the migration table: each toolkit name with its replacement.

  **Review:** matches **Toolkit** in size, weight and colour, icon by icon; the glyphs differ (Phosphor draws them, not the brand). The social logos and campus-specific names (Bluesky, Substack, Weibo, Yelp, Flickr, admissions, donor, …) are the nearest Phosphor idea.
-->
<Story
  name="IlwUi"
  parameters={{ styles: 'ilw-ui' }}
  play={async ({ canvas, canvasElement }) => {
    const icons = canvasElement.querySelectorAll<SVGSVGElement>('.icon-grid svg');
    await expect(icons).toHaveLength(toolkitIcons.length * 2);
    for (const svg of icons) {
      await expect(svg).toHaveClass('ilw-icon');
      await expect(svg).toHaveAttribute('aria-hidden', 'true');
      await expect(svg).not.toHaveAttribute('role');
    }
    const li = canvasElement.querySelector('.icon-grid li')!;
    // The text is in the brand font, as on the toolkit side, and it has loaded.
    await expect(getComputedStyle(li).fontFamily).toMatch(/^"?Source Sans/);
    await document.fonts.ready;
    await expect(document.fonts.check('1rem "Source Sans"')).toBe(true);
    // 1em: the icon follows the text's size and colour, as a font glyph does.
    await expect(icons[0].getBoundingClientRect().height).toBeCloseTo(parseFloat(getComputedStyle(li).fontSize), 0);
    await expect(getComputedStyle(icons[0]).fill).toBe(getComputedStyle(li).color);
    // A labelled icon is an image with that name, at the size asked for.
    const labelled = canvas.getByRole('img', { name: 'Calendar' });
    await expect(labelled).toHaveAttribute('width', '2rem');
    const row = canvasElement.querySelector<HTMLElement>('.ilw-icon-row')!;
    await expect(getComputedStyle(row).display).toBe('flex');
    await expect(getComputedStyle(row).columnGap).toBe('18px');
  }}
>
  <ul class="icon-grid">
    {#each toolkitIcons as [name, icon] (name)}
      <li><Icon {icon} /><Icon {icon} type="line" /> {name}</li>
    {/each}
  </ul>
  <p>Next session: <Icon icon={Calendar} alt="Calendar" size="2rem" /></p>
  <div class="ilw-icon-row">
    <Icon icon={Envelope} size="18px" />
    <p>Email the department office.</p>
  </div>
</Story>

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same grid on both sides, name by name. Under the Dark toolbar setting both follow the text colour.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-icon" theme={String(context.globals.theme ?? 'light')} height={2400} />
  {/snippet}
</Story>
