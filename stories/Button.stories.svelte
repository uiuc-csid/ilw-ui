<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, userEvent, waitFor } from 'storybook/test';

  import { Button } from '../src/svelte/index.ts';
  import ButtonDemo from './ButtonDemo.svelte';
  import ButtonSurfaces from './ButtonSurfaces.svelte';

  const { Story } = defineMeta({
    title: 'Button',
    // ilw-ui's styles only: button.css replaces the toolkit's button rules.
    parameters: { styles: 'ilw-ui' },
    // The Docs page lists every story with its review notes (the comment above it).
    tags: ['autodocs'],
  });

  // WCAG relative luminance and contrast of computed `rgb()` colours.
  const rgb = (css: string) => (css.match(/rgba?\(([^)]*)\)/)?.[1] ?? '').split(/[\s,/]+/).filter(Boolean).slice(0, 3).map(Number);
  const lum = (css: string) => {
    const [r, g, b] = rgb(css).map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a: string, b: string) => {
    const [lo, hi] = [lum(a), lum(b)].sort((x, y) => x - y);
    return (hi + 0.05) / (lo + 0.05);
  };

  /** Tabs to each surface's button and checks one of its two focus rings reaches 3:1 against the surface. */
  async function checkRings(canvasElement: HTMLElement, outline: string) {
    const buttons = [...canvasElement.querySelectorAll<HTMLButtonElement>('section button')];
    await expect(buttons).toHaveLength(4);
    for (const button of buttons) {
      await userEvent.tab();
      await expect(button).toHaveFocus();
      const style = getComputedStyle(button);
      const surface = getComputedStyle(button.closest('section')!).backgroundColor;
      await expect(style.outlineStyle).toBe('solid');
      await expect(parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2);
      // Proves which mode's focus colours are in play.
      await expect(style.outlineColor).toBe(outline);
      const ring = Math.max(contrast(style.outlineColor, surface), contrast(style.boxShadow, surface));
      await expect(ring, `focus ring on ${button.textContent}`).toBeGreaterThanOrEqual(3);
    }
  }
</script>

<!--
  Has no `play` function: the fixture `tests/e2e/button.spec.ts` drives with the keyboard.

  **Why:** a link and a button, each enabled and disabled, between two native buttons, so the spec can see what Tab reaches and what Enter and Space do.

  **Review:** Tab goes Before, Link button, Plain button, After: both disabled controls are skipped. Enter on the link moves focus to its target below (`#button-demo-target`, `tabindex="-1"`); Enter or Space on Plain button counts up; clicking a disabled one does nothing.
-->
<Story name="Fixture" asChild>
  <ButtonDemo />
</Story>

<!--
  The DOM contract, checked in the DOM.

  **Why:** ta-manager and server templates rely on this markup: `<a class="ilw-button">` with an `href`, `<button type="button" class="ilw-button">`; a disabled button uses `disabled` (never `aria-disabled`), a disabled link loses its `href` and gets `role="link"` and `aria-disabled="true"`.

  **Review:** same as Fixture; the test also clicks both disabled controls and checks neither handler runs.
-->
<Story
  name="Contract"
  asChild
  play={async ({ canvas, userEvent }) => {
    const link = canvas.getByRole('link', { name: 'Link button' });
    await expect(link.tagName).toBe('A');
    await expect(link).toHaveClass('ilw-button');
    await expect(link).toHaveAttribute('href', '#button-demo-target');

    const button = canvas.getByRole('button', { name: 'Plain button' });
    await expect(button).toHaveAttribute('type', 'button');
    await expect(button).toHaveClass('ilw-button');
    await userEvent.click(button);
    await waitFor(() => expect(canvas.getByTestId('pressed')).toHaveTextContent('1'));

    const off = canvas.getByRole('button', { name: 'Disabled button' });
    await expect(off).toBeDisabled();
    await expect(off).not.toHaveAttribute('aria-disabled');

    const offLink = canvas.getByRole('link', { name: 'Disabled link' });
    await expect(offLink).not.toHaveAttribute('href');
    await expect(offLink).toHaveAttribute('aria-disabled', 'true');
    await expect(offLink).not.toHaveAttribute('tabindex');

    await userEvent.click(off);
    await userEvent.click(offLink);
    await expect(canvas.getByTestId('disabled-pressed')).toHaveTextContent('0');
  }}
>
  <ButtonDemo />
</Story>

<!--
  The `size` and `theme` props, as classes.

  **Why:** `size` maps to `.ilw-button-small` / `-large` (medium adds nothing) and `theme` to the toolkit's `.ilw-theme-*` class on the element itself.

  **Review:** a small blue outline link, a medium solid blue button and a large orange outline button.
-->
<Story
  name="Sizes And Themes"
  asChild
  play={async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Small' })).toHaveClass('ilw-button', 'ilw-button-small');
    const medium = canvas.getByRole('button', { name: 'Solid' });
    await expect(medium.className).toBe('ilw-button ilw-theme-blue-solid');
    await expect(canvas.getByRole('button', { name: 'Large' })).toHaveClass('ilw-button', 'ilw-button-large', 'ilw-theme-orange');
  }}
>
  <p>
    <Button href="#small" size="small">Small</Button>
    <Button theme="blue-solid">Solid</Button>
    <Button size="large" theme="orange">Large</Button>
  </p>
</Story>

<!--
  A button on every flat theme surface, focused in turn (light mode).

  **Why:** WCAG 1.4.11: the focus ring must stand out from what's around it by 3:1. The ring is two lines, `--ilw-color--focus--background` then `--ilw-color--focus--text`; the test tabs to each button and checks one of them clears 3:1 against its surface.

  **Review:** Tab through: each button shows a light ring inside a dark line.
-->
<Story name="Focus Rings" asChild play={({ canvasElement }) => checkRings(canvasElement, 'rgb(19, 41, 75)')}>
  <ButtonSurfaces />
</Story>

<!--
  The same, in dark mode.

  **Why:** dark mode swaps the focus colours (white on Blue 30), so the check runs again.

  **Review:** Tab through: each button shows a dark ring inside a white line.
-->
<Story name="Focus Rings Dark" asChild globals={{ theme: 'dark' }} play={({ canvasElement }) => checkRings(canvasElement, 'rgb(255, 255, 255)')}>
  <ButtonSurfaces />
</Story>
