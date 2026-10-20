import { expect, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

test('the skip link is first, and following it moves focus into main', async ({ page }) => {
  await openStory(page, 'page-chrome-page--fixture');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  const main = page.getByRole('main');

  // Hidden until focused.
  await expect(skip).not.toBeInViewport();
  await press(page, 'Tab');
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();

  await press(page, 'Enter');
  await expect(main).toBeFocused();
  await expect(skip).not.toBeInViewport();

  // The next Tab continues from main: the first breadcrumb, not the header.
  await press(page, 'Tab');
  await expect(page.getByRole('navigation', { name: 'Breadcrumbs' }).getByRole('link', { name: 'Home' })).toBeFocused();
});

test('Tab walks the breadcrumbs, the content and the footer in order, never stopping on the current page', async ({ page }) => {
  await openStory(page, 'page-chrome-page--fixture');
  const crumbs = page.getByRole('navigation', { name: 'Breadcrumbs' });
  const expected = [
    page.getByRole('link', { name: 'Skip to main content' }),
    crumbs.getByRole('link', { name: 'Home' }),
    crumbs.getByRole('link', { name: 'Academics' }),
    page.getByRole('link', { name: 'a link' }),
    page.getByRole('contentinfo').getByRole('link', { name: 'Sample Site' }),
    page.getByRole('link', { name: 'University of Illinois Urbana-Champaign' }),
  ];
  for (const link of expected) {
    await press(page, 'Tab');
    await expect(link).toBeFocused();
  }
});
