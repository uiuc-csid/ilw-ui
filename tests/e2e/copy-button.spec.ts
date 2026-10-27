import { expect, type Page, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

// The Fixture story's beforeEach replaces navigator.clipboard with an in-memory
// stub, so these run without a clipboard permission in either browser.
const clipboardText = (page: Page) => page.evaluate(() => navigator.clipboard.readText());

// Located by position, not by name: the name changes to "Copied" while the
// button shows it, and a name locator would stop matching.
const shareButton = (page: Page) => page.locator('#share-link ~ button');
const tokenButton = (page: Page) => page.locator('#new-token ~ button');

test('Enter and Space copy, announce and keep focus on the button', async ({ page }) => {
  await openStory(page, 'copybutton--fixture');
  const input = page.getByRole('textbox', { name: 'Course link' });
  const button = shareButton(page);
  await expect(button).toHaveAccessibleName('Copy link');

  await input.focus();
  await press(page, 'Tab');
  await expect(button).toBeFocused();
  await press(page, 'Enter');
  await expect(button).toHaveAttribute('data-state', 'copied');
  await expect(button).toHaveAccessibleName('Copied');
  expect(await clipboardText(page)).toBe('https://tam.cs.illinois.edu/courses/cs-225/fa26');
  await expect(page.getByRole('status')).toHaveText('Copied');
  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute('data-state', 'idle');
  await expect(button).toHaveAccessibleName('Copy link');
  await expect(button).toBeFocused();

  // Tab moves on to the token's button; Space copies it.
  await press(page, 'Tab');
  const token = tokenButton(page);
  await expect(token).toHaveAccessibleName('Copy token');
  await expect(token).toBeFocused();
  await press(page, 'Space');
  await expect(token).toHaveAttribute('data-state', 'copied');
  expect(await clipboardText(page)).toBe('tam_7Qx2dH9kLm4Rv8Zp');
  await expect(token).toBeFocused();
  await expect(page.getByRole('status')).toHaveText('Copied');
});

test('an icon-only button is reached by Tab and copies its row', async ({ page }) => {
  await openStory(page, 'copybutton--fixture');
  await tokenButton(page).focus();
  await press(page, 'Tab');
  const netid = page.getByRole('row', { name: /Alan Turing/ }).getByRole('button');
  await expect(netid).toHaveAccessibleName('Copy netid of Alan Turing');
  await expect(netid).toBeFocused();
  await press(page, 'Enter');
  await expect(netid).toHaveAccessibleName('Copied');
  expect(await clipboardText(page)).toBe('aturing2');
  await expect(netid).toBeFocused();
  await expect(netid).toHaveAccessibleName('Copy netid of Alan Turing');
});
