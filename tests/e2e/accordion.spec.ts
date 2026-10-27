import { expect, type Page, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

const panel = (page: Page, n: number) => page.locator('details.ilw-accordion-panel').nth(n);
const summary = (page: Page, n: number) => panel(page, n).locator('> summary');

test('Tab walks the buttons, then each header; a closed panel’s links are skipped', async ({ page }) => {
  await openStory(page, 'accordion--fixture');
  const expected = [
    page.getByRole('link', { name: 'Skip to main content' }),
    page.getByRole('button', { name: 'Expand All Enrollment FAQ' }),
    page.getByRole('button', { name: 'Collapse All Enrollment FAQ' }),
    ...[0, 1, 2, 3].map((n) => summary(page, n)),
    page.getByRole('link', { name: 'Contact the admissions office' }),
  ];
  for (const target of expected) {
    await press(page, 'Tab');
    await expect(target).toBeFocused();
  }
  for (const target of expected.slice(0, -1).reverse()) {
    await press(page, 'Shift+Tab');
    await expect(target).toBeFocused();
  }
});

test('Enter and Space toggle a panel, focus stays on its header, and its links join the Tab order', async ({ page }) => {
  await openStory(page, 'accordion--fixture');
  await summary(page, 1).focus();

  await press(page, 'Enter');
  await expect(panel(page, 1)).toHaveAttribute('open');
  await expect(summary(page, 1)).toBeFocused();
  await press(page, 'Tab');
  await expect(page.getByRole('link', { name: 'admissions portal' })).toBeFocused();
  await press(page, 'Shift+Tab');
  await expect(summary(page, 1)).toBeFocused();

  await press(page, 'Space');
  await expect(panel(page, 1)).not.toHaveAttribute('open');
  await expect(summary(page, 1)).toBeFocused();
  await press(page, 'Space');
  await expect(panel(page, 1)).toHaveAttribute('open');
});

test('Expand All and Collapse All open and close every panel by keyboard, keeping focus', async ({ page }) => {
  await openStory(page, 'accordion--fixture');
  const panels = page.locator('details.ilw-accordion-panel');
  const expand = page.getByRole('button', { name: 'Expand All Enrollment FAQ' });
  const collapse = page.getByRole('button', { name: 'Collapse All Enrollment FAQ' });

  await expand.focus();
  await press(page, 'Enter');
  await expect(panels.and(page.locator('[open]'))).toHaveCount(4);
  await expect(expand).toBeFocused();

  await press(page, 'Tab');
  await expect(collapse).toBeFocused();
  await press(page, 'Space');
  await expect(panels.and(page.locator('[open]'))).toHaveCount(0);
  await expect(collapse).toBeFocused();
});

test('In single-open mode, opening a panel closes the open one', async ({ page }) => {
  await openStory(page, 'accordion--single-fixture');
  await expect(page.getByRole('button', { name: /Expand All/ })).toHaveCount(0);

  await summary(page, 0).focus();
  await press(page, 'Enter');
  await expect(panel(page, 0)).toHaveAttribute('open');

  await press(page, 'Tab');
  // The first panel's body has no links, so Tab goes straight to the next header.
  await expect(summary(page, 1)).toBeFocused();
  await press(page, 'Enter');
  await expect(panel(page, 1)).toHaveAttribute('open');
  await expect(panel(page, 0)).not.toHaveAttribute('open');
  await expect(summary(page, 1)).toBeFocused();
});
