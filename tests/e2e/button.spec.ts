import { expect, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

test('Tab reaches the link and the button and skips both disabled forms', async ({ page }) => {
  await openStory(page, 'button--fixture');
  const order = ['Before', 'Link button', 'Plain button', 'After'];

  await page.getByRole('button', { name: 'Before' }).focus();
  for (const name of order.slice(1)) {
    await press(page, 'Tab');
    await expect(page.getByRole(name === 'Link button' ? 'link' : 'button', { name })).toBeFocused();
  }
  for (const name of order.slice(0, -1).reverse()) {
    await press(page, 'Shift+Tab');
    await expect(page.getByRole(name === 'Link button' ? 'link' : 'button', { name })).toBeFocused();
  }
});

test('Enter and Space press the button; Enter follows the link', async ({ page }) => {
  await openStory(page, 'button--fixture');
  const pressed = page.getByTestId('pressed');

  await page.getByRole('link', { name: 'Link button' }).focus();
  await press(page, 'Tab');
  const button = page.getByRole('button', { name: 'Plain button' });
  await expect(button).toBeFocused();
  await press(page, 'Enter');
  await expect(pressed).toHaveText('1');
  await press(page, 'Space');
  await expect(pressed).toHaveText('2');
  await expect(button).toBeFocused();
  await expect(page.getByTestId('disabled-pressed')).toHaveText('0');

  await press(page, 'Shift+Tab');
  await expect(page.getByRole('link', { name: 'Link button' })).toBeFocused();
  await press(page, 'Enter');
  await expect(page).toHaveURL(/#button-demo-target$/);
  // The target has tabindex="-1", so focus follows the link there.
  await expect(page.locator('#button-demo-target')).toBeFocused();
});
