<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';

  import ThemeGrid from './parity/ThemeGrid.svelte';

  // No autodocs: the two stories differ only by the theme global, which a Docs
  // page (one document) can't hold two values of.
  const { Story } = defineMeta({
    title: 'Themes',
    component: ThemeGrid,
    parameters: { styles: 'ilw-ui' },
  });

  const swatch = (canvasElement: HTMLElement, id: string) => canvasElement.querySelector<HTMLElement>(`[data-theme-id="${id}"]`)!;
  const bg = (el: Element) => getComputedStyle(el).backgroundColor;
  const fg = (el: Element) => getComputedStyle(el).color;
</script>

<!--
  Every theme class and `[theme]` attribute, ilw-ui's styles only, light.

  **Why:** components read `--ilw-color--*` and never name a theme; this shows what each theme sets them to. axe checks text contrast in every swatch.

  **Review:** blue themes are Illinois Blue with white text; orange themes Illinois Orange with blue text and white headings; `.ilw-theme-orange` and `-outline` change only the control (white with orange text); `.ilw-theme-blue` and `-outline` are white. The gradients run Industrial to Blue and Harvest to Orange.
-->
<Story
  name="Light"
  globals={{ theme: 'light' }}
  play={async ({ canvasElement }) => {
    await expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    // The toolkit stylesheet is out of this story; ours is in.
    await expect(document.querySelector('link[data-ilw-styles="toolkit"]')).toBeNull();
    await expect(document.querySelector('link[data-ilw-styles="ilw-ui"]')).not.toBeNull();
    await expect(bg(swatch(canvasElement, 'default'))).toBe('rgb(255, 255, 255)');
    await expect(fg(swatch(canvasElement, 'default'))).toBe('rgb(37, 37, 37)');
    await expect(bg(swatch(canvasElement, 'blue'))).toBe('rgb(255, 255, 255)');
    await expect(bg(swatch(canvasElement, 'blue-1'))).toBe('rgb(19, 41, 75)');
    await expect(bg(swatch(canvasElement, 'attr-blue'))).toBe('rgb(19, 41, 75)');
    await expect(bg(swatch(canvasElement, 'orange-solid'))).toBe('rgb(255, 95, 5)');
    await expect(fg(swatch(canvasElement, 'orange-solid'))).toBe('rgb(19, 41, 75)');
    await expect(bg(swatch(canvasElement, 'attr-gray'))).toBe('rgb(244, 244, 244)');
    // .ilw-theme-orange swaps only the control.
    const orange = swatch(canvasElement, 'orange');
    await expect(bg(orange)).toBe('rgb(255, 255, 255)');
    await expect(bg(orange.querySelector('button')!)).toBe('rgb(255, 255, 255)');
    await expect(fg(orange.querySelector('button')!)).toBe('rgb(255, 95, 5)');
    await expect(getComputedStyle(swatch(canvasElement, 'attr-blue-gradient')).backgroundImage).toMatch(/^linear-gradient/);
  }}
/>

<!--
  The same grid with `html[data-theme="dark"]`, as the toolkit header's dark-mode toggle sets it.

  **Why:** the white and gray palettes and the focus colours have dark values; the blue, orange and gradient themes keep theirs. axe checks the dark text contrast.

  **Review:** the page and the default, `.ilw-theme-blue` and `[theme=white]` swatches are near-black blue with light text and light-blue links; `[theme=gray]` is dark gray. Tab to a link or control: the focus outline is light blue. Check focus outlines and control borders against WCAG 1.4.11 (3:1) by eye.
-->
<Story
  name="Dark"
  globals={{ theme: 'dark' }}
  play={async ({ canvasElement }) => {
    await expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    const def = swatch(canvasElement, 'default');
    await expect(bg(def)).toBe('rgb(17, 24, 29)');
    await expect(fg(def)).toBe('rgb(244, 244, 244)');
    await expect(fg(def.querySelector('a')!)).toBe('rgb(202, 217, 239)');
    await expect(bg(swatch(canvasElement, 'attr-white'))).toBe('rgb(17, 24, 29)');
    await expect(bg(swatch(canvasElement, 'attr-gray'))).toBe('rgb(37, 37, 37)');
    // Strong themes keep their light values.
    await expect(bg(swatch(canvasElement, 'blue-1'))).toBe('rgb(19, 41, 75)');
    await expect(bg(swatch(canvasElement, 'orange-1'))).toBe('rgb(255, 95, 5)');
  }}
/>
