<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, waitFor } from 'storybook/test';

  import Tooltip from '../../src/svelte/Tooltip.svelte';
  import { attrs } from './attrs.ts';
  import SideBySide from './SideBySide.svelte';

  import './Tooltip.parity.stories.css';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets.
  const { Story } = defineMeta({ title: 'Parity/Tooltip' });

  const plain = 'Download the grades as a CSV file';
  const blue = 'Print the table on one page per section';

  // Opens every <ilw-tooltip> as a pointer does: upstream listens for mouseenter on the trigger.
  async function openToolkit(root: HTMLElement) {
    await customElements.whenDefined('ilw-tooltip');
    for (const el of root.querySelectorAll('ilw-tooltip')) {
      await (el as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
      el.querySelector('[slot="trigger"]')!.dispatchEvent(new MouseEvent('mouseenter'));
      await waitFor(() => expect(el).toHaveAttribute('visible'));
    }
  }
</script>

<!--
  Two `<ilw-tooltip>`s, the default and `theme="blue"`, both shown, styled and scripted by the vendored toolkit only.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code. The play function opens both with the `mouseenter` upstream listens for.

  **Review:** compare with **IlwUi** or **Side By Side**: a white and a blue bubble above their buttons, each with a downward arrow at its centre.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }} play={({ canvasElement }) => openToolkit(canvasElement)}>
  <div class="tooltip-parity-row">
    <ilw-tooltip>
      <button type="button" class="ilw-button" slot="trigger">Export</button>
      <span slot="content">{plain}</span>
    </ilw-tooltip>
    <ilw-tooltip {@attach attrs({ theme: 'blue' })}>
      <button type="button" class="ilw-button" slot="trigger">Print</button>
      <span slot="content">{blue}</span>
    </ilw-tooltip>
  </div>
</Story>

<!--
  The same two as `Tooltip`s, opened with `open`, styled by ilw-ui's `tooltip.css` only.

  **Why:** the play function checks the look against upstream's: at most 200 px wide, 8 px 12 px padding, an 8 px radius, upstream's shadow, 1 rem text at 1.375 rem line height, 12 px above the button and centred on it; white with storm text, or blue with white text.

  **Review:** matches **Toolkit**. Hover or Tab to the buttons: the bubbles stay; Escape closes them.
-->
<Story
  name="IlwUi"
  parameters={{ styles: 'ilw-ui' }}
  play={async ({ canvas }) => {
    const looks = [
      { name: 'Export', bg: 'rgb(255, 255, 255)', fg: 'rgb(37, 37, 37)' },
      { name: 'Print', bg: 'rgb(19, 41, 75)', fg: 'rgb(255, 255, 255)' },
    ];
    for (const { name, bg, fg } of looks) {
      const trigger = canvas.getByRole('button', { name });
      const bubble = document.getElementById(trigger.getAttribute('aria-describedby')!)!;
      await waitFor(() => expect(bubble.matches(':popover-open')).toBe(true));
      const style = getComputedStyle(bubble);
      await expect([style.backgroundColor, style.color]).toEqual([bg, fg]);
      await expect([style.paddingTop, style.paddingLeft, style.borderTopLeftRadius]).toEqual(['8px', '12px', '8px']);
      await expect(style.boxShadow).toBe('rgba(0, 0, 0, 0.1) 2px 0px 4px 4px');
      await expect([style.fontSize, style.lineHeight, style.fontWeight]).toEqual(['16px', '22px', '400']);
      const t = trigger.getBoundingClientRect();
      const b = bubble.getBoundingClientRect();
      await expect(b.width).toBeLessThanOrEqual(200);
      await expect(Math.abs(b.bottom - (t.top - 12))).toBeLessThanOrEqual(1);
      await expect(Math.abs(b.left + b.width / 2 - (t.left + t.width / 2))).toBeLessThanOrEqual(1);
    }
  }}
>
  <div class="tooltip-parity-row">
    <Tooltip text={plain} open>
      {#snippet children(attrs)}<button type="button" class="ilw-button" {...attrs}>Export</button>{/snippet}
    </Tooltip>
    <Tooltip text={blue} theme="blue" open>
      {#snippet children(attrs)}<button type="button" class="ilw-button" {...attrs}>Print</button>{/snippet}
    </Tooltip>
  </div>
</Story>

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same two bubbles in each frame.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-tooltip" theme={String(context.globals.theme ?? 'light')} height={220} />
  {/snippet}
</Story>
