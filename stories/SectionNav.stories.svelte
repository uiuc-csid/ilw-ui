<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect } from 'storybook/test';

  import SectionNav from '../src/svelte/SectionNav.svelte';
  import { programs } from './section-nav-data.ts';

  // The section nav (B6), ilw-ui's styles only, in the page shell's main.
  const { Story } = defineMeta({
    title: 'Page Chrome/Section nav',
    parameters: { styles: 'ilw-ui' },
  });
</script>

<!--
  `SectionNav` as a server renders it: the current page's branches open, the rest closed. No play function: the keyboard spec (`tests/e2e/page-chrome.spec.ts`) drives this one from a fresh load.

  **Why:** the fixture for the toggle checks (Enter and Space on a `summary`, the narrow-width "Pages In This Section" toggle).

  **Review:** "Undergraduate Degrees" and "Animal Sciences Major" are open down to the current page, which is orange with a small triangle. Each branch has a chevron at its right: Tab reaches the link, then the chevron; Enter or Space toggles it. Narrower than 700 px the list hides behind "Pages In This Section".
-->
<Story name="Fixture">
  <div style:max-width="20rem">
    <SectionNav items={programs} />
  </div>
</Story>

<!--
  Every disclosure open: the narrow-width toggle (`open`) and every branch (`expanded`), as the toolkit always shows them.

  **Why:** the "open" story, so axe scans every link. The play function checks the contract: a nav named by the toggle's summary, the root link, link-plus-toggle siblings, the toggles' names, `open` on the current page's ancestors and `aria-current="page"` on it.

  **Review:** the whole tree shows, indented by level, with each chevron pointing up.
-->
<Story
  name="Open"
  play={async ({ canvas, canvasElement }) => {
    const nav = canvas.getByRole('navigation', { name: 'Pages In This Section' });
    await expect(nav).toHaveClass('ilw-section-nav');
    const collapse = nav.querySelector(':scope > details.ilw-section-nav-collapse')!;
    await expect(collapse).toHaveAttribute('open');
    await expect(nav.getAttribute('aria-labelledby')).toBe(collapse.querySelector(':scope > summary')!.id);

    const top = collapse.querySelectorAll(':scope > ul > li');
    await expect(top).toHaveLength(3);
    await expect(top[0].firstElementChild).toHaveClass('ilw-section-nav--root');

    // A branch: the link, then a sibling details whose summary holds only the toggle's name and an icon.
    const branch = top[1];
    await expect(branch).toHaveClass('ilw-section-nav-branch');
    await expect([...branch.children].map((el) => el.tagName)).toEqual(['A', 'DETAILS']);
    const summary = branch.querySelector(':scope > details > summary')!;
    await expect(summary.querySelector('a, button, input')).toBeNull();
    await expect(summary).toHaveAccessibleName('Subpages of Undergraduate Degrees');
    await expect(summary.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

    // The current page, and every branch open (expanded).
    const current = canvas.getByRole('link', { name: 'Pre-Veterinary and Medical' });
    await expect(current).toHaveAttribute('aria-current', 'page');
    await expect(canvasElement.querySelectorAll('[aria-current]')).toHaveLength(1);
    await expect(canvasElement.querySelectorAll('.ilw-section-nav-branch > details:not([open])')).toHaveLength(0);
  }}
>
  <div style:max-width="20rem">
    <SectionNav items={programs} open expanded />
  </div>
</Story>

<!--
  The default: only the current page's ancestors open, and the play function checks that.

  **Why:** `SectionNav` sets `open` from `current`, so the server sends the current branch open without script.

  **Review:** as **Fixture**.
-->
<Story
  name="Current branch"
  play={async ({ canvasElement }) => {
    const open = [...canvasElement.querySelectorAll('.ilw-section-nav-branch > details[open]')];
    await expect(open.map((d) => d.parentElement!.firstElementChild!.textContent)).toEqual([
      'Undergraduate Degrees',
      'Animal Sciences Major',
    ]);
    const closed = canvasElement.querySelector('.ilw-section-nav-branch > details:not([open])')!;
    await expect(closed.parentElement!.firstElementChild).toHaveTextContent('Computer & Animal Science');
    // A closed branch's children are not rendered.
    await expect(closed.querySelector('a')).not.toBeVisible();
  }}
>
  <div style:max-width="20rem">
    <SectionNav items={programs} />
  </div>
</Story>

<!--
  The same open nav with `html[data-theme="dark"]`.

  **Why:** the colours come from the theme properties, so dark mode follows without per-component rules. axe checks the dark contrast.

  **Review:** light text on the dark page; the root link and toggle on the dark grey plate.
-->
<Story name="Dark" globals={{ theme: 'dark' }}>
  <div style:max-width="20rem">
    <SectionNav items={programs} open expanded />
  </div>
</Story>
