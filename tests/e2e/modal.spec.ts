import { expect, test } from '@playwright/test';

import { expectFocusNotOnBody, openStory, press } from './focus.ts';

test('Tab stays in the modal, Escape closes it, focus returns to the trigger', async ({ page }) => {
  await openStory(page, 'modal--trigger');
  const trigger = page.getByRole('button', { name: 'Delete assignment' });
  const modal = page.locator('ilw-modal[open]');
  const cancel = modal.getByRole('button', { name: 'Cancel', exact: true });
  const del = modal.getByRole('button', { name: 'Delete', exact: true });
  const close = modal.getByRole('button', { name: 'Close modal' });

  await press(page, 'Tab');
  await expect(trigger).toBeFocused();
  await press(page, 'Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(cancel).toBeFocused();

  // Cancel → Delete → × → back to Cancel, and the reverse; never leaves the modal.
  await press(page, 'Tab');
  await expect(del).toBeFocused();
  await press(page, 'Tab');
  await expect(close).toBeFocused();
  await press(page, 'Tab');
  await expect(cancel).toBeFocused();
  await press(page, 'Shift+Tab');
  await expect(close).toBeFocused();

  await press(page, 'Escape');
  await expect(page.locator('ilw-modal')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page.locator('output')).toHaveText('false');
});

test('Enter on the confirm button resolves true and returns focus', async ({ page }) => {
  await openStory(page, 'modal--trigger');
  const trigger = page.getByRole('button', { name: 'Delete assignment' });
  await trigger.focus();
  await press(page, 'Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  await press(page, 'Tab');
  await press(page, 'Enter');
  await page.locator('ilw-modal').waitFor({ state: 'detached' });
  await expectFocusNotOnBody(page);
  await expect(trigger).toBeFocused();
  await expect(page.locator('output')).toHaveText('true');
});
