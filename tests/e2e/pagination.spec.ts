import { expect, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

test('Tab walks First, Previous, the page links (the current one included), Next and Last, skipping the ellipses and the count', async ({ page }) => {
  await openStory(page, 'pagination--fixture');
  const nav = page.getByRole('navigation', { name: 'Pages' });
  const expected = [
    page.getByRole('link', { name: 'Skip to main content' }),
    nav.getByRole('link', { name: 'First page' }),
    nav.getByRole('link', { name: 'Previous page' }),
    ...[1, 4, 5, 6, 7, 8, 12].map((n) => nav.getByRole('link', { name: `Page ${n}`, exact: true })),
    nav.getByRole('link', { name: 'Next page' }),
    nav.getByRole('link', { name: 'Last page' }),
  ];
  for (const link of expected) {
    await press(page, 'Tab');
    await expect(link).toBeFocused();
  }
  for (const link of expected.slice(0, -1).reverse()) {
    await press(page, 'Shift+Tab');
    await expect(link).toBeFocused();
  }
});

test('Enter follows a page link', async ({ page }) => {
  await openStory(page, 'pagination--fixture');
  const next = page.getByRole('navigation', { name: 'Pages' }).getByRole('link', { name: 'Next page' });
  await next.focus();
  await press(page, 'Enter');
  await expect(page).toHaveURL(/#page-7$/);
  await expect(next).toBeFocused();
});
