import { expect, type Page, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

const STORY = 'page-chrome-dark-mode-toggle--fixture';

/** Tabs past the story shell's skip link to the switch. */
async function tabToSwitch(page: Page): Promise<void> {
  await press(page, 'Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await press(page, 'Tab');
  await expect(page.getByRole('switch', { name: 'Dark mode' })).toBeFocused();
}

test('Space toggles the switch, sets data-theme and writes a year-long cookie', async ({ page, context }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await openStory(page, STORY);
  const toggle = page.getByRole('switch', { name: 'Dark mode' });
  const theme = () => page.evaluate(() => document.documentElement.dataset.theme ?? null);

  await expect(toggle).not.toBeChecked();
  expect(await theme()).toBeNull();

  await tabToSwitch(page);

  await press(page, 'Space');
  await expect(toggle).toBeChecked();
  await expect(toggle).toBeFocused();
  expect(await theme()).toBe('dark');

  const cookie = (await context.cookies()).find((c) => c.name === 'ilw-dark-mode');
  expect(cookie).toMatchObject({ value: 'true', path: '/', sameSite: 'Lax' });
  const days = (cookie!.expires - Date.now() / 1000) / 86400;
  expect(days).toBeGreaterThan(364);
  expect(days).toBeLessThan(366);

  await press(page, 'Space');
  await expect(toggle).not.toBeChecked();
  expect(await theme()).toBe('light');
  expect((await context.cookies()).find((c) => c.name === 'ilw-dark-mode')?.value).toBe('false');
});

test('follows the OS preference until the user chooses', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await openStory(page, STORY);
  const toggle = page.getByRole('switch', { name: 'Dark mode' });

  await expect(toggle).toBeChecked();
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(toggle).not.toBeChecked();
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(toggle).toBeChecked();

  await tabToSwitch(page);
  await press(page, 'Space');
  await expect(toggle).not.toBeChecked();

  // Chosen: the OS no longer moves it.
  await page.emulateMedia({ colorScheme: 'light' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(toggle).not.toBeChecked();
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('light');
});
