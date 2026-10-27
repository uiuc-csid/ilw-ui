import { expect, type Locator, type Page, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

const WIDE = { width: 1280, height: 800 };
const NARROW = { width: 390, height: 800 };

/** Presses Tab once per locator, checking each is focused in turn. */
async function tabThrough(page: Page, expected: Locator[]): Promise<void> {
  for (const el of expected) {
    await press(page, 'Tab');
    await expect(el).toBeFocused();
  }
}

function header(page: Page) {
  const banner = page.getByRole('banner');
  const nav = banner.getByRole('navigation', { name: 'Main' });
  return {
    skip: page.getByRole('link', { name: 'Skip to main content' }),
    wordmark: banner.getByRole('link', { name: 'University of Illinois Urbana-Champaign' }),
    parent: banner.getByRole('link', { name: 'Web Implementation Guidelines Group' }),
    site: banner.getByRole('link', { name: 'Component Builder' }),
    toggle: banner.locator('.ilw-header-toggle'),
    menu: banner.locator('.ilw-header-menu'),
    utility: banner.getByRole('navigation', { name: 'Utility' }).getByRole('link'),
    field: banner.getByRole('searchbox', { name: 'Search' }),
    submit: banner.getByRole('button', { name: 'Search' }),
    nav,
    summary: (label: string) => nav.locator('summary', { hasText: label }),
    content: page.getByRole('main').getByRole('link', { name: 'a link' }),
  };
}

test.describe('wide (1280 px)', () => {
  test.use({ viewport: WIDE });

  test('Tab runs through the header in reading order, skipping the hidden "Menu" button', async ({ page }) => {
    await openStory(page, 'page-chrome-header--fixture');
    const h = header(page);
    await expect(h.toggle).toBeHidden();
    await tabThrough(page, [
      h.skip,
      h.wordmark,
      h.parent,
      h.site,
      h.utility.nth(0),
      h.utility.nth(1),
      h.field,
      h.submit,
      h.nav.getByRole('link', { name: 'About' }),
      h.summary('Start Here'),
      h.nav.getByRole('link', { name: 'Information' }),
      h.summary('Subpages of Information'),
      h.nav.getByRole('link', { name: 'Components' }),
      h.content,
    ]);
  });

  test('a section opens with Enter and closes with Space; its links come next; one section is open at a time', async ({ page }) => {
    await openStory(page, 'page-chrome-header--fixture');
    const h = header(page);
    const startHere = h.summary('Start Here');
    const information = h.summary('Subpages of Information');
    await startHere.focus();

    await press(page, 'Enter');
    await expect(startHere.locator('..')).toHaveAttribute('open', '');
    const first = h.nav.getByRole('link', { name: 'Getting Started' });
    await expect(first).toBeVisible();
    await press(page, 'Tab');
    await expect(first).toBeFocused();

    await press(page, 'Shift+Tab');
    await expect(startHere).toBeFocused();
    await press(page, 'Space');
    await expect(startHere.locator('..')).not.toHaveAttribute('open');
    await expect(first).toBeHidden();

    // Opening another section closes the first (one `details` name).
    await press(page, 'Enter');
    await information.focus();
    await press(page, 'Enter');
    await expect(information.locator('..')).toHaveAttribute('open', '');
    await expect(startHere.locator('..')).not.toHaveAttribute('open');

    // A nested section opens beside its parent, which stays open.
    const garnet = h.summary('Subpages of Garnet');
    await tabThrough(page, [
      h.nav.getByRole('link', { name: 'Philosophy' }),
      h.nav.getByRole('link', { name: 'Helpful Links' }),
      h.nav.getByRole('link', { name: 'Garnet' }),
      garnet,
    ]);
    await press(page, 'Enter');
    await expect(garnet.locator('..')).toHaveAttribute('open', '');
    await expect(information.locator('..')).toHaveAttribute('open', '');
    await press(page, 'Tab');
    await expect(h.nav.getByRole('link', { name: 'Gneiss' })).toBeFocused();
  });

  test('a megamenu panel opens from its button, is next in the Tab order, and Escape closes it and returns focus', async ({
    page,
  }) => {
    await openStory(page, 'page-chrome-header--fixture-megamenu');
    const h = header(page);
    const about = h.nav.getByRole('button', { name: 'About' });
    const admissions = h.nav.getByRole('button', { name: 'Admissions' });
    const aboutPanel = page.locator('#ilw-header-mega-1');
    const admissionsPanel = page.locator('#ilw-header-mega-2');

    await about.focus();
    await press(page, 'Enter');
    await expect(aboutPanel).toBeVisible();
    await press(page, 'Tab');
    await expect(aboutPanel.getByRole('link', { name: 'Directory' })).toBeFocused();

    await press(page, 'Escape');
    await expect(aboutPanel).toBeHidden();
    await expect(about).toBeFocused();

    // One panel at a time.
    await press(page, 'Enter');
    await expect(aboutPanel).toBeVisible();
    await admissions.focus();
    await press(page, 'Enter');
    await expect(admissionsPanel).toBeVisible();
    await expect(aboutPanel).toBeHidden();
    await press(page, 'Escape');
    await expect(admissionsPanel).toBeHidden();
    await expect(admissions).toBeFocused();

    // Closed, the panels are skipped: Research, then the dark-mode switch, then the content.
    await tabThrough(page, [
      h.nav.getByRole('link', { name: 'Research' }),
      page.getByRole('switch', { name: 'Dark mode' }),
      h.content,
    ]);
  });
});

test.describe('narrow (390 px)', () => {
  test.use({ viewport: NARROW });

  test('"Menu" follows the site name; it opens the menu, which is next in the Tab order; Escape closes it and returns focus', async ({
    page,
  }) => {
    await openStory(page, 'page-chrome-header--fixture');
    const h = header(page);
    await expect(h.menu).toBeHidden();
    await tabThrough(page, [h.skip, h.wordmark, h.parent, h.site, h.toggle]);
    await expect(h.toggle).toHaveAccessibleName('Menu');

    // Closed, the menu is skipped: the next stop is the content.
    await press(page, 'Tab');
    await expect(h.content).toBeFocused();
    await press(page, 'Shift+Tab');
    await expect(h.toggle).toBeFocused();

    await press(page, 'Enter');
    await expect(h.menu).toBeVisible();
    await tabThrough(page, [
      h.utility.nth(0),
      h.utility.nth(1),
      h.field,
      h.submit,
      h.nav.getByRole('link', { name: 'About' }),
      h.summary('Start Here'),
    ]);

    // A section opens in place; its links follow.
    await press(page, 'Space');
    await press(page, 'Tab');
    await expect(h.nav.getByRole('link', { name: 'Getting Started' })).toBeFocused();

    await press(page, 'Escape');
    await expect(h.menu).toBeHidden();
    await expect(h.toggle).toBeFocused();

    // Enter on "Menu" again opens it; Enter on the button again closes it.
    await press(page, 'Enter');
    await expect(h.menu).toBeVisible();
    await press(page, 'Enter');
    await expect(h.menu).toBeHidden();
    await expect(h.toggle).toBeFocused();
  });

  test('a megamenu panel opens inside the open menu; Escape closes only the panel and returns focus; "Menu" closes the menu', async ({
    page,
  }) => {
    await openStory(page, 'page-chrome-header--fixture-megamenu');
    const h = header(page);
    await h.toggle.focus();
    await press(page, 'Enter');
    await expect(h.menu).toBeVisible();

    const admissions = h.nav.getByRole('button', { name: 'Admissions' });
    const panel = page.locator('#ilw-header-mega-2');
    await admissions.focus();
    await press(page, 'Enter');
    await expect(panel).toBeVisible();
    await press(page, 'Tab');
    await expect(panel.getByRole('link', { name: 'Undergraduate Admissions' })).toBeFocused();

    await press(page, 'Escape');
    await expect(panel).toBeHidden();
    await expect(h.menu).toBeVisible();
    await expect(admissions).toBeFocused();

    // With a megamenu the menu is a manual popover: Escape leaves it open; its button closes it.
    await press(page, 'Escape');
    await expect(h.menu).toBeVisible();
    await h.toggle.focus();
    await press(page, 'Enter');
    await expect(h.menu).toBeHidden();
  });
});
