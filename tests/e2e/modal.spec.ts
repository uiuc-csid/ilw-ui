import { expect, test } from '@playwright/test';

import { expectFocusNotOnBody, openStory, press } from './focus.ts';

test('Tab stays in the modal, Escape closes it, focus returns to the trigger', async ({ page }) => {
  await openStory(page, 'modal--trigger');
  const trigger = page.getByRole('button', { name: 'Delete assignment' });
  const modal = page.getByRole('dialog', { name: 'Delete assignment?' });
  const cancel = modal.getByRole('button', { name: 'Cancel', exact: true });
  const del = modal.getByRole('button', { name: 'Delete', exact: true });
  const close = modal.getByRole('button', { name: 'Close', exact: true });

  // The Page shell's skip link comes first.
  await press(page, 'Tab');
  await press(page, 'Tab');
  await expect(trigger).toBeFocused();
  await press(page, 'Enter');
  await expect(modal).toBeVisible();
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
  await expect(page.locator('dialog')).toHaveCount(0);
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
  await page.locator('dialog').waitFor({ state: 'detached' });
  await expectFocusNotOnBody(page);
  await expect(trigger).toBeFocused();
  await expect(page.locator('output')).toHaveText('true');
});

test('A click on the backdrop dismisses; a click in the dialog does not', async ({ page }) => {
  await openStory(page, 'modal--trigger');
  const trigger = page.getByRole('button', { name: 'Delete assignment' });
  // By keyboard: WebKit, like Safari, doesn't focus a button on click, so there would be no focus to return.
  await trigger.focus();
  await press(page, 'Enter');
  const modal = page.getByRole('dialog');
  await expect(modal).toBeVisible();
  const box = (await modal.boundingBox())!;
  await page.mouse.click(box.x + 4, box.y + box.height - 4);
  await expect(modal).toBeVisible();
  await page.mouse.click(4, box.y + box.height + 20);
  await page.locator('dialog').waitFor({ state: 'detached' });
  await expect(trigger).toBeFocused();
  await expect(page.locator('output')).toHaveText('false');
});

test('Content added while open joins the Tab cycle', async ({ page }) => {
  await openStory(page, 'modal--form-trigger');
  await page.getByRole('button', { name: 'Rename section' }).click();
  const modal = page.getByRole('dialog', { name: 'Rename section' });
  const input = modal.getByRole('textbox', { name: 'New name' });
  await expect(input).toBeFocused();

  await page.keyboard.type('Lab A');
  const preview = modal.getByRole('link', { name: 'Preview “Lab A”' });
  await press(page, 'Tab');
  await expect(preview).toBeFocused();
  await press(page, 'Tab');
  await expect(modal.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  await press(page, 'Tab');
  await expect(modal.getByRole('button', { name: 'Rename', exact: true })).toBeFocused();
  await press(page, 'Tab');
  await expect(modal.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
  await press(page, 'Tab');
  await expect(input).toBeFocused();
  await press(page, 'Shift+Tab');
  await expect(modal.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
});
