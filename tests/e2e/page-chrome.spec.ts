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

test.describe('section nav', () => {
  test('Tab reaches a branch link, then its toggle; Enter and Space toggle it', async ({ page }) => {
    await openStory(page, 'page-chrome-section-nav--fixture');
    const nav = page.getByRole('navigation', { name: 'Pages In This Section' });
    const link = nav.getByRole('link', { name: 'Computer & Animal Science' });
    const details = nav.locator('.ilw-section-nav-branch:has(> a[href="#cs-animal"]) > details');
    const toggle = details.locator('> summary');
    const child = nav.getByRole('link', { name: 'Some Third Thing' });

    await link.focus();
    await press(page, 'Tab');
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAccessibleName('Subpages of Computer & Animal Science');
    await expect(child).toBeHidden();

    await press(page, 'Enter');
    await expect(details).toHaveAttribute('open');
    await expect(child).toBeVisible();
    await expect(toggle).toBeFocused();

    await press(page, 'Space');
    await expect(details).not.toHaveAttribute('open');
    await expect(child).toBeHidden();

    await press(page, 'Space');
    await expect(details).toHaveAttribute('open');
    // The children come straight after the toggle.
    await press(page, 'Tab');
    await expect(child).toBeFocused();
  });

  test('the current branch is open and walks link, toggle, children in order', async ({ page }) => {
    await openStory(page, 'page-chrome-section-nav--fixture');
    const nav = page.getByRole('navigation', { name: 'Pages In This Section' });
    await nav.getByRole('link', { name: 'Programs of Study' }).focus();
    const expected = [
      nav.getByRole('link', { name: 'Undergraduate Degrees' }),
      nav.getByText('Subpages of Undergraduate Degrees').locator('..'),
      nav.getByRole('link', { name: 'Animal Sciences Major' }),
      nav.getByText('Subpages of Animal Sciences Major').locator('..'),
      nav.getByRole('link', { name: 'Pre-Veterinary and Medical' }),
      nav.getByRole('link', { name: 'Companion Animal Equine' }),
      nav.getByRole('link', { name: 'Computer & Animal Science' }),
    ];
    for (const el of expected) {
      await press(page, 'Tab');
      await expect(el).toBeFocused();
    }
  });

  test('narrower than 700 px, the list hides behind "Pages In This Section"', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 800 });
    await openStory(page, 'page-chrome-section-nav--fixture');
    const nav = page.getByRole('navigation', { name: 'Pages In This Section' });
    const collapse = nav.locator('> details');
    const toggle = collapse.locator('> summary');
    const root = nav.getByRole('link', { name: 'Programs of Study' });

    await expect(toggle).toBeVisible();
    await expect(root).toBeHidden();
    // Tab: the skip link, then the toggle.
    await press(page, 'Tab');
    await press(page, 'Tab');
    await expect(toggle).toBeFocused();
    await press(page, 'Enter');
    await expect(collapse).toHaveAttribute('open');
    await expect(root).toBeVisible();
    await press(page, 'Tab');
    await expect(root).toBeFocused();
  });

  test('700 px and wider, the list shows and the toggle is not in the Tab order', async ({ page }) => {
    await openStory(page, 'page-chrome-section-nav--fixture');
    const nav = page.getByRole('navigation', { name: 'Pages In This Section' });
    await expect(nav.locator('> details')).not.toHaveAttribute('open');
    await expect(nav.locator('> details > summary')).toBeHidden();
    await press(page, 'Tab');
    await press(page, 'Tab');
    await expect(nav.getByRole('link', { name: 'Programs of Study' })).toBeFocused();
  });
});

test.describe('back to top', () => {
  test('it is the last stop, shown when focused, and following it puts the next Tab on the skip link', async ({ page }) => {
    await openStory(page, 'page-chrome-back-to-top--fixture');
    const link = page.getByRole('link', { name: 'Back to top' });

    // At the top of the page it is transparent, unless scroll-driven animations are missing.
    const animated = await page.evaluate(() => CSS.supports('animation-timeline: scroll()'));
    await expect(link).toHaveCSS('opacity', animated ? '0' : '1');

    // After the footer's last link.
    await page.getByRole('contentinfo').getByRole('link').last().focus();
    await press(page, 'Tab');
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS('opacity', '1');
    await expect(link).toBeInViewport();

    await page.evaluate(() => window.scrollTo({ top: document.scrollingElement!.scrollHeight, behavior: 'instant' }));
    // Focus moves to the shell (tabindex="-1"), not to <body>; the next Tab is its first child.
    await press(page, 'Enter');
    await expect(page.locator('.ilw-page#top')).toBeFocused();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await press(page, 'Tab');
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  });

  test('scrolling a screen reveals it', async ({ page }) => {
    await openStory(page, 'page-chrome-back-to-top--fixture');
    const link = page.getByRole('link', { name: 'Back to top' });
    await page.mouse.move(400, 300);
    await page.mouse.wheel(0, 3000);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
    await expect(link).toHaveCSS('opacity', '1');
    await link.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });
});
