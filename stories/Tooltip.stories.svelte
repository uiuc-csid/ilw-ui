<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, userEvent, waitFor } from 'storybook/test';

  import Tooltip, { type TooltipArrow } from '../src/svelte/Tooltip.svelte';
  import TooltipDemo from './TooltipDemo.svelte';

  // No `component`: every story renders its own Tooltips, and Storybook would
  // otherwise render a bare Tooltip (with no `children`) from the args.
  const { Story } = defineMeta({
    title: 'Overlays/Tooltip',
    parameters: { styles: 'ilw-ui' },
  });

  const ARROWS: TooltipArrow[] = [
    'top-left',
    'top-center',
    'top-right',
    'left',
    'right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ];

  /** The bubble a trigger's `aria-describedby` names. */
  function bubbleOf(trigger: Element): HTMLElement {
    return document.getElementById(trigger.getAttribute('aria-describedby')!)!;
  }

  const isOpen = (bubble: Element) => bubble.matches(':popover-open');

  /** Checks the bubble sits 12px off the trigger's `arrow` side, aligned as upstream aligns it. */
  async function expectPlaced(trigger: Element, bubble: Element, arrow: TooltipArrow) {
    const t = trigger.getBoundingClientRect();
    const b = bubble.getBoundingClientRect();
    const [side, align = 'center'] = arrow.split('-');
    const near = (actual: number, expected: number, what: string) =>
      expect(Math.abs(actual - expected), `${arrow}: ${what} (${actual} vs ${expected})`).toBeLessThanOrEqual(1);
    if (side === 'top') await near(b.bottom, t.top - 12, 'gap above');
    if (side === 'bottom') await near(b.top, t.bottom + 12, 'gap below');
    if (side === 'left') await near(b.right, t.left - 12, 'gap left');
    if (side === 'right') await near(b.left, t.right + 12, 'gap right');
    if (side === 'left' || side === 'right') await near(b.top + b.height / 2, t.top + t.height / 2, 'middle');
    else if (align === 'left') await near(b.left, t.left, 'left edge');
    else if (align === 'right') await near(b.right, t.right, 'right edge');
    else {
      // Centred, unless that would put it within 8px of the viewport's side.
      const max = document.documentElement.clientWidth - 8 - b.width;
      await near(b.left, Math.max(8, Math.min(t.left + (t.width - b.width) / 2, max)), 'centre');
    }
  }
</script>

<!--
  The grade book page: three icon buttons with tooltips and a help link with one. No play function: the keyboard spec (`tests/e2e/tooltip.spec.ts`) drives this one from a fresh load.

  **Why:** the fixture for the focus, hover, Escape and hover-persistence checks.

  **Review:** Tab to the Export button: "Download the grades as a CSV file" appears above it. Hover the buttons; move the pointer from a button up onto its bubble: it stays. Press Escape: it closes. Tab to "Which scores?": its bubble is on the right.
-->
<Story name="Fixture">
  <TooltipDemo />
</Story>

<!--
  The same page with the Export tooltip open from the start.

  **Why:** the open state, for axe (contrast of the bubble, `role="tooltip"` naming). The play function checks the contract: the trigger's `aria-describedby` names a `span.ilw-tooltip-bubble[role=tooltip][popover=manual]` in the `span.ilw-tooltip` wrapper, the trigger's description is the tooltip text, and the trigger is the wrapper's first child, and the bubble is above it, left edges aligned (the toolbar's `arrow="top-left"`), 12 px off, 200 px wide at most, in upstream's colours, padding and radius.

  **Review:** a white bubble with a small arrow pointing down at the Export button from near the bubble's left end. Switch to dark: it turns dark.
-->
<Story
  name="Open"
  play={async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: 'Export' });
    const bubble = bubbleOf(trigger);
    await expect(trigger).toHaveAccessibleDescription('Download the grades as a CSV file');
    await expect(bubble).toHaveRole('tooltip');
    await expect(bubble).toHaveClass('ilw-tooltip-bubble');
    await expect(bubble).toHaveAttribute('popover', 'manual');
    await expect(bubble.parentElement).toHaveClass('ilw-tooltip', 'ilw-tooltip--top-left');
    await expect(bubble.parentElement!.firstElementChild).toBe(trigger);
    await expect(bubble.parentElement).toContainElement(trigger);
    await waitFor(() => expect(isOpen(bubble)).toBe(true));
    await expectPlaced(trigger, bubble, 'top-left');

    const style = getComputedStyle(bubble);
    await expect(style.backgroundColor).toBe('rgb(255, 255, 255)');
    await expect(style.color).toBe('rgb(37, 37, 37)');
    await expect([style.paddingTop, style.paddingLeft, style.borderTopLeftRadius]).toEqual(['8px', '12px', '8px']);
    await expect(style.fontSize).toBe('16px');
    await expect(bubble.getBoundingClientRect().width).toBeLessThanOrEqual(200);
  }}
>
  <TooltipDemo open />
</Story>

<!--
  The grade book page; the play function hovers, focuses and dismisses.

  **Why:** the behaviour under user events. Hidden at first; hover shows it and leaving hides it; hover then onto the bubble keeps it (WCAG 1.4.13 hoverable); focus shows it and blur hides it; Escape hides it while focus stays on the trigger (1.4.13 dismissible); hovering again shows it. The keyboard spec repeats this with real input.

  **Review:** as **Fixture**.
-->
<Story
  name="Hover and focus"
  play={async ({ canvas }) => {
    const exportButton = canvas.getByRole('button', { name: 'Export' });
    const print = canvas.getByRole('button', { name: 'Print' });
    const bubble = bubbleOf(exportButton);
    await expect(isOpen(bubble)).toBe(false);
    await expect(bubble).not.toBeVisible();

    await userEvent.hover(exportButton);
    await waitFor(() => expect(isOpen(bubble)).toBe(true));
    await userEvent.hover(bubble);
    await expect(isOpen(bubble)).toBe(true);
    await userEvent.unhover(bubble);
    await userEvent.hover(print);
    await waitFor(() => expect(isOpen(bubble)).toBe(false));
    await waitFor(() => expect(isOpen(bubbleOf(print))).toBe(true));
    await userEvent.unhover(print);
    await waitFor(() => expect(isOpen(bubbleOf(print))).toBe(false));

    exportButton.focus();
    await waitFor(() => expect(isOpen(bubble)).toBe(true));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(isOpen(bubble)).toBe(false));
    await expect(exportButton).toHaveFocus();
    await userEvent.hover(exportButton);
    await waitFor(() => expect(isOpen(bubble)).toBe(true));
    await userEvent.unhover(exportButton);
    // Still focused, so still shown; blurring hides it.
    await expect(isOpen(bubble)).toBe(true);
    exportButton.blur();
    await waitFor(() => expect(isOpen(bubble)).toBe(false));
  }}
>
  <TooltipDemo />
</Story>

<!--
  The grade book page with the toolbar's tooltips in the blue theme, the first one open.

  **Why:** `theme="blue"` on the bubble takes the blue palette from tokens.css, as the toolkit's `theme="blue"` does; the play function checks its colours. axe checks its contrast.

  **Review:** a blue bubble with white text and a blue arrow above the Export button.
-->
<Story
  name="Blue"
  play={async ({ canvas }) => {
    const bubble = bubbleOf(canvas.getByRole('button', { name: 'Export' }));
    await waitFor(() => expect(isOpen(bubble)).toBe(true));
    await expect(bubble).toHaveAttribute('theme', 'blue');
    const style = getComputedStyle(bubble);
    await expect(style.backgroundColor).toBe('rgb(19, 41, 75)');
    await expect(style.color).toBe('rgb(255, 255, 255)');
  }}
>
  <TooltipDemo open theme="blue" />
</Story>

<!--
  A row of "Help" buttons on a form's instructions, one per `arrow` value.

  **Why:** the placement table. The play function focuses each button and checks its bubble is 12 px off the named side and aligned as upstream aligns it (left edges, centres or right edges), placed by anchor positioning where supported. The keyboard spec checks the script fallback.

  **Review:** Tab along the row: each bubble appears on the side its button names.
-->
<Story
  name="Placements"
  play={async ({ canvas }) => {
    for (const arrow of ARROWS) {
      const trigger = canvas.getByRole('button', { name: arrow });
      const bubble = bubbleOf(trigger);
      trigger.focus();
      await waitFor(() => expect(isOpen(bubble)).toBe(true));
      await expectPlaced(trigger, bubble, arrow);
      trigger.blur();
      await waitFor(() => expect(isOpen(bubble)).toBe(false));
    }
  }}
>
  <h1>Placements</h1>
  <p>Each button's tooltip sits on the side its name gives, with the arrow pointing back at it.</p>
  <div class="placements">
    {#each ARROWS as arrow (arrow)}
      <Tooltip {arrow} text="Tooltip text that wraps onto a second line.">
        {#snippet children(attrs)}
          <button type="button" class="ilw-button" {...attrs}>{arrow}</button>
        {/snippet}
      </Tooltip>
    {/each}
  </div>
</Story>

<style>
  /* Three rows: top-*, then left and right at the ends, then bottom-*. About 900px wide, with
     room on each side for the left and right bubbles, so no bubble reaches the viewport's edge. */
  .placements {
    display: grid;
    grid-template-columns: repeat(3, 8rem);
    gap: 6rem 2rem;
    padding: 6rem 14rem;
    width: max-content;
  }

  .placements > :global(:nth-child(5)) {
    grid-column: 3;
  }
</style>
