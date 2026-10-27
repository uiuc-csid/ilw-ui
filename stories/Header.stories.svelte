<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, waitFor, within } from 'storybook/test';

  import Header from '../src/svelte/Header.svelte';
  import Page from '../src/svelte/Page.svelte';
  import { menu, megamenu, parentUnit, utilityLinks } from './header-sample.ts';

  // The header is the page's banner, so each story renders a whole page (the
  // shell, the header and a little content) and skips Storybook's wrapper.
  // Under 990 px the menu is a popover behind "Menu"; the open stories show it
  // from their play functions, so axe scans it at any width.
  const { Story } = defineMeta({
    title: 'Page Chrome/Header',
    parameters: { styles: 'ilw-ui', shell: false, layout: 'fullscreen' },
    args: { mega: false, darkModeToggle: false },
  });

  /** The menu popover, its toggle and the `details` named `<label>`'s section. */
  function parts(canvasElement: HTMLElement) {
    const header = canvasElement.querySelector<HTMLElement>('header.ilw-header')!;
    const menuEl = header.querySelector<HTMLElement>('.ilw-header-menu')!;
    const section = (label: string) =>
      [...header.querySelectorAll<HTMLDetailsElement>('.ilw-header-nav details')].find((d) =>
        d.querySelector(':scope > summary')!.textContent!.trim().startsWith(label),
      )!;
    return { header, menuEl, section };
  }

  /**
   * Opens the menu the way "Menu" does, when "Menu" is showing (under 990 px).
   * From 990 px the menu is already part of the header; opening it there would
   * turn it back into a panel. Returns whether it opened.
   */
  function openMenu(header: HTMLElement, menuEl: HTMLElement): boolean {
    const toggle = header.querySelector('.ilw-header-toggle')!;
    if (getComputedStyle(toggle).display === 'none') return false;
    menuEl.showPopover();
    return true;
  }
</script>

{#snippet page(args: { mega?: boolean; darkModeToggle?: boolean })}
  <Page format>
    {#snippet header()}
      <Header
        siteName="Component Builder"
        siteHref="#home"
        {parentUnit}
        source="ilw_ui"
        links={utilityLinks}
        search={{ action: '#search' }}
        nav={args.mega ? megamenu : menu}
        megamenu={args.mega}
        darkModeToggle={args.darkModeToggle}
      />
    {/snippet}
    <h2>Page content</h2>
    <p>The page content, with <a href="#a-link">a link</a> to tab to after the header.</p>
  </Page>
{/snippet}

<!--
  The header with every part: wordmark, parent unit, site name, utility links, search and a disclosure menu (a link, a section, a linked section with nested sections, a link).

  **Why:** the play function checks the markup contract: the banner, the wordmark's name and UTM link, the "Utility" and "Main" navigations, the GET search form labelled by its button, the `details` groups (top-level sections share one `name`, nested ones another), the linked section's separate toggle, `aria-current` on the current page, and the "Menu" button's `popovertarget`.

  **Review:** at 990 px and wider, the toolkit's layout; narrower, a "Menu" button that opens everything under the header. Open a section: its links drop down; open another: the first closes.
-->
<Story
  name="Default"
  template={page}
  play={async ({ canvas, canvasElement }) => {
    const { header, menuEl, section } = parts(canvasElement);
    const banner = canvas.getByRole('banner');
    await expect(banner).toBe(header);
    await expect(banner.parentElement).toHaveClass('ilw-page');

    // Wordmark: named link to illinois.edu with the header's UTM parameters; the SVGs are hidden.
    const wordmark = canvas.getByRole('link', { name: 'University of Illinois Urbana-Champaign' });
    await expect(wordmark).toHaveClass('ilw-header-wordmark');
    await expect(wordmark).toHaveAttribute('href', 'https://illinois.edu/?utm_source=ilw_ui&utm_medium=web&utm_campaign=Header');
    for (const svg of wordmark.querySelectorAll('svg')) await expect(svg).toHaveAttribute('aria-hidden', 'true');

    // Identity.
    const identity = header.querySelector('.ilw-header-main > .ilw-header-identity')!;
    await expect(identity.querySelector('a.ilw-header-parent-unit')).toHaveAttribute('href', '#wigg');
    await expect(identity.querySelector('a.ilw-header-site-name')).toHaveTextContent('Component Builder');

    // The "Menu" button opens the menu popover (it is hidden from 990 px, so check its text, not its name).
    const toggle = header.querySelector<HTMLButtonElement>('.ilw-header-main > button.ilw-header-toggle')!;
    await expect(toggle).toHaveTextContent(/^\s*Menu\s*$/);
    await expect(toggle).toHaveAttribute('type', 'button');
    await expect(toggle).toHaveAttribute('popovertarget', menuEl.id);
    await expect(menuEl).toHaveAttribute('popover', '');
    await expect(menuEl.parentElement).toBe(header);

    // Utility links, search, main nav and the order the menu holds them in.
    const inMenu = within(menuEl);
    const utility = inMenu.getByRole('navigation', { name: 'Utility', hidden: true });
    await expect(utility).toHaveClass('ilw-header-links');
    await expect(utility.querySelectorAll(':scope > ul > li > a')).toHaveLength(2);
    const form = menuEl.querySelector<HTMLFormElement>('form.ilw-header-search')!;
    await expect(form).toHaveAttribute('role', 'search');
    await expect(form.method).toBe('get');
    await expect(form.getAttribute('action')).toBe('#search');
    const field = form.querySelector('input')!;
    const submit = form.querySelector('button')!;
    await expect(field).toHaveAttribute('type', 'search');
    await expect(field).toHaveAttribute('name', 'q');
    await expect(field).toHaveAttribute('aria-labelledby', submit.id);
    await expect(field).toHaveAccessibleName('Search');
    await expect(submit).toHaveAttribute('type', 'submit');
    const nav = inMenu.getByRole('navigation', { name: 'Main', hidden: true });
    await expect(nav).toHaveClass('ilw-header-nav');
    await expect([...menuEl.children].map((c) => c.className)).toEqual(['ilw-header-links', 'ilw-header-search', 'ilw-header-nav']);

    // Sections: top-level ones share a name; nested ones have their own, so opening one keeps its parent open.
    const top = nav.querySelectorAll<HTMLDetailsElement>(':scope > ul > li > details');
    const startHere = section('Start Here');
    await expect(startHere.parentElement!.parentElement!.parentElement).toBe(nav);
    await expect(startHere.name).toBe('ilw-header-nav');
    for (const d of top) await expect(d.name).toBe('ilw-header-nav');
    const garnet = nav.querySelector<HTMLDetailsElement>('.ilw-header-nav-linked .ilw-header-nav-linked > details')!;
    await expect(garnet.name).not.toBe('ilw-header-nav');
    await expect(nav.querySelector('details details')!.getAttribute('name')).toBe(garnet.name);

    // A linked section: the link, then a separate chevron-only toggle named after it.
    const linked = nav.querySelector(':scope > ul > li.ilw-header-nav-linked')!;
    await expect(linked.firstElementChild).toHaveAttribute('href', '#information');
    const linkedToggle = linked.querySelector(':scope > details > summary')!;
    await expect(linkedToggle).toHaveAccessibleName('Subpages of Information');
    await expect(linkedToggle.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    await expect(linkedToggle.querySelector('a')).toBeNull();

    // The current page.
    const current = nav.querySelectorAll('[aria-current]');
    await expect(current).toHaveLength(1);
    await expect(current[0]).toHaveAttribute('aria-current', 'page');
    await expect(current[0]).toHaveTextContent('Philosophy');

    // ids are unique.
    const ids = [...header.querySelectorAll('[id]')].map((el) => el.id);
    await expect(new Set(ids).size).toBe(ids.length);
  }}
/>

<!--
  The header with a disclosure menu. No play function: the keyboard spec (`tests/e2e/header.spec.ts`) drives this one from a fresh load, at wide and narrow widths.

  **Why:** the fixture for the focus-order, `details` and popover checks.

  **Review:** Tab from the top: skip link, wordmark, parent unit, site name, ("Menu" when narrow), the utility links, the search field and button, then the nav items.
-->
<Story name="Fixture" template={page} />

<!--
  The header with a megamenu and the dark-mode toggle. No play function: the keyboard spec drives it.

  **Why:** the fixture for the megamenu popovers (open from their buttons, Escape closes and returns focus) and for the dark-mode switch's place in the focus order.

  **Review:** "About" and "Admissions" open full-width panels under the bar; "Research" is a link. The switch sits at the right end of the bar.
-->
<Story name="Fixture Megamenu" args={{ mega: true, darkModeToggle: true }} template={page} />

<!--
  The "Information" section and its nested "Garnet" section open (and, under 990 px, the menu around them).

  **Why:** axe scans the open menu and both open dropdowns. The play function checks the `details` groups: opening "Start Here" closes "Information" (one `name`), and opening a nested section leaves its parent open (its own `name`).

  **Review:** narrow, the menu lists everything under the header with the open sections in flow; wide, "Information" drops down with "Garnet" open to its right.
-->
<Story
  name="Menu Open"
  template={page}
  play={async ({ canvasElement }) => {
    const { header, menuEl, section } = parts(canvasElement);
    openMenu(header, menuEl);

    const startHere = section('Start Here');
    const information = section('Subpages of Information');
    information.open = true;
    startHere.open = true;
    await waitFor(() => expect(information.open).toBe(false));

    information.open = true;
    await waitFor(() => expect(startHere.open).toBe(false));
    const garnet = section('Subpages of Garnet');
    garnet.open = true;
    await expect(information.open).toBe(true);
    await expect(garnet.open).toBe(true);
    await expect(garnet.querySelector('ul a')).toBeVisible();
  }}
/>

<!--
  **Menu Open** on a phone-sized viewport (Storybook's `mobile1`), where the menu is a popover under the header.

  **Why:** axe scans the narrow layout's open menu and sections. The play function checks the "Menu" button shows, the menu is in the top layer under the header, and its sections open in flow.

  **Review:** the "MENU" button shows an ×; the menu fills the width under the header.
-->
<Story
  name="Menu Open Narrow"
  globals={{ viewport: { value: 'mobile1', isRotated: false } }}
  template={page}
  play={async ({ canvas, canvasElement }) => {
    const { header, menuEl, section } = parts(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Menu' });
    await expect(toggle).toBeVisible();
    menuEl.showPopover();
    await expect(menuEl.matches(':popover-open')).toBe(true);
    // The anchored panel starts where the header's main row ends and spans the width.
    const main = header.querySelector('.ilw-header-main')!.getBoundingClientRect();
    const box = menuEl.getBoundingClientRect();
    await expect(Math.round(box.top)).toBe(Math.round(main.bottom));
    await expect(Math.round(box.width)).toBe(document.documentElement.clientWidth);
    const startHere = section('Start Here');
    startHere.open = true;
    const first = startHere.querySelector('ul a')!;
    await expect(first).toBeVisible();
    // In flow: the next item moves down below the open list.
    await expect(startHere.closest('li')!.nextElementSibling!.getBoundingClientRect().top).toBeGreaterThan(
      first.getBoundingClientRect().bottom,
    );
  }}
/>

<!--
  The megamenu with the menu and the "Admissions" panel open.

  **Why:** axe scans an open megamenu panel. The play function checks the panels are `popover="auto"` (opening "Admissions" closes "About") and the menu around them is `popover="manual"`, so it stays open.

  **Review:** narrow, the panel lists its columns under the "Admissions" button; wide, a 1270 px panel of columns under the bar.
-->
<Story
  name="Megamenu Open"
  args={{ mega: true }}
  template={page}
  play={async ({ canvas, canvasElement }) => {
    const { header, menuEl } = parts(canvasElement);
    // A manual popover, so a panel inside it restores focus when Escape closes it.
    await expect(menuEl).toHaveAttribute('popover', 'manual');
    const narrow = openMenu(header, menuEl);
    const buttons = menuEl.querySelectorAll<HTMLButtonElement>('.ilw-header-megamenu-toggle');
    await expect(buttons).toHaveLength(2);
    const panel = (b: HTMLButtonElement) => canvasElement.ownerDocument.getElementById(b.getAttribute('popovertarget')!)!;
    for (const b of buttons) {
      await expect(b).toHaveAttribute('type', 'button');
      await expect(panel(b)).toHaveAttribute('popover', '');
      await expect(panel(b)).toHaveClass('ilw-header-megamenu-panel');
      // The panel follows its button, so it is next in the Tab order.
      await expect(b.nextElementSibling).toBe(panel(b));
    }
    await expect(buttons[0]).toHaveAccessibleName('About');
    await expect(canvas.getByRole('link', { name: 'Research', hidden: true }).closest('li')!.querySelector('[popover]')).toBeNull();

    panel(buttons[0]).showPopover();
    panel(buttons[1]).showPopover();
    await expect(panel(buttons[0]).matches(':popover-open')).toBe(false);
    await expect(panel(buttons[1]).matches(':popover-open')).toBe(true);
    await expect(menuEl.matches(':popover-open')).toBe(narrow);
    await expect(within(panel(buttons[1])).getByRole('link', { name: 'Apply' })).toBeVisible();
  }}
/>

<!--
  The header on a dark page (`html[data-theme="dark"]`), with the dark-mode toggle (and the menu open, under 990 px).

  **Why:** the header takes its colours from the theme: a dark background, light text, a dark bar. The play function checks those and that the toggle's island host renders the switch in the menu, already mounted. axe checks the dark contrast.

  **Review:** dark header, light wordmark and text; the block I keeps its blue box and orange rule. The switch is on.
-->
<Story
  name="Dark"
  globals={{ theme: 'dark' }}
  args={{ darkModeToggle: true }}
  template={page}
  play={async ({ canvasElement }) => {
    const { header, menuEl } = parts(canvasElement);
    openMenu(header, menuEl);
    await expect(getComputedStyle(header).backgroundColor).toBe('rgb(17, 24, 29)');
    await expect(getComputedStyle(header).color).toBe('rgb(225, 231, 241)');
    await expect(getComputedStyle(header).borderTopColor).toBe('rgb(255, 95, 5)');
    await expect(getComputedStyle(header.querySelector('.ilw-header-block-i')!).backgroundColor).toBe('rgb(19, 41, 75)');

    const host = menuEl.querySelector('[data-ilw-island="dark-mode-toggle"]')!;
    await expect(host).toHaveAttribute('data-ilw-mounted');
    await expect(menuEl.lastElementChild).toBe(host);
    const toggle = within(host as HTMLElement).getByRole('switch', { name: 'Dark mode' });
    await expect(toggle).toBeChecked();
  }}
/>

<!--
  A site name as the page's `<h1>`, with no parent unit, links, search or nav.

  **Why:** with nothing to put in it, there is no menu and no "Menu" button (the toolkit's `menu="none"`). The play function checks the heading wraps the link.

  **Review:** the wordmark and a bold site name, nothing else; no "Menu" on a narrow screen.
-->
<Story
  name="Site Name Only"
  play={async ({ canvas, canvasElement }) => {
    const heading = canvas.getByRole('heading', { level: 1, name: 'Component Builder' });
    await expect(heading).toHaveClass('ilw-header-site-name');
    await expect(heading.querySelector('a')).toHaveAttribute('href', '#home');
    await expect(canvasElement.querySelector('.ilw-header-toggle')).toBeNull();
    await expect(canvasElement.querySelector('.ilw-header-menu')).toBeNull();
  }}
>
  <Page format>
    {#snippet header()}
      <Header siteName="Component Builder" siteHref="#home" heading />
    {/snippet}
    <p>Content.</p>
  </Page>
</Story>
