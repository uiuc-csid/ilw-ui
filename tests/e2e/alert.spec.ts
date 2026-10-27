import { expect, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

const SAVE_ERROR = 'components-alert--save-error-fixture';
const SERVER = 'components-alert--server-markup-fixture';

test('Tab reaches the actions, then the dismiss button; dismissing moves focus to the next field', async ({ page }) => {
  await openStory(page, SAVE_ERROR);
  const alert = page.getByRole('alert');
  await expect(alert).toContainText("Your changes weren't saved");

  await press(page, 'Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await press(page, 'Tab');
  await expect(alert.getByRole('button', { name: 'Try again' })).toBeFocused();
  await press(page, 'Tab');
  await expect(alert.getByRole('link', { name: 'Log in again' })).toBeFocused();
  await press(page, 'Tab');
  await expect(alert.getByRole('button', { name: 'Dismiss' })).toBeFocused();

  await press(page, 'Enter');
  await expect(alert).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Course title' })).toBeFocused();
  // Shift+Tab goes back up the page, not into a ghost of the alert.
  await press(page, 'Shift+Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
});

test('"Try again" swaps in the success status and puts focus on Save; Space dismisses that', async ({ page }) => {
  await openStory(page, SAVE_ERROR);
  await press(page, 'Tab');
  await press(page, 'Tab');
  await expect(page.getByRole('button', { name: 'Try again' })).toBeFocused();

  await press(page, 'Enter');
  await expect(page.getByRole('alert')).toHaveCount(0);
  const status = page.getByRole('status');
  await expect(status).toContainText('Settings saved.');
  await expect(page.getByRole('button', { name: 'Save' })).toBeFocused();

  // Back up through the form to the status's dismiss button.
  await press(page, 'Shift+Tab');
  await press(page, 'Shift+Tab');
  await press(page, 'Shift+Tab');
  await expect(status.getByRole('button', { name: 'Dismiss' })).toBeFocused();
  await press(page, 'Space');
  await expect(status).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Course title' })).toBeFocused();

  // Saving fails again: the error comes back, and focus stays on Save.
  await page.getByRole('button', { name: 'Save' }).focus();
  await press(page, 'Enter');
  await expect(page.getByRole('alert')).toContainText("Your changes weren't saved");
  await expect(page.getByRole('button', { name: 'Save' })).toBeFocused();
});

test('server-rendered messages: enhanceAlerts shows the dismiss buttons, and each dismissal moves focus on', async ({ page }) => {
  await openStory(page, SERVER);
  const dismiss = page.getByRole('button', { name: 'Dismiss message' });
  await expect(dismiss).toHaveCount(2);

  await press(page, 'Tab');
  await press(page, 'Tab');
  await expect(dismiss.first()).toBeFocused();
  await expect(page.getByRole('status').first()).toContainText('Your profile was updated.');

  await press(page, 'Enter');
  await expect(page.getByRole('status')).toHaveCount(1);
  await expect(dismiss).toHaveCount(1);
  await expect(dismiss).toBeFocused();

  await press(page, 'Enter');
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Edit profile' })).toBeFocused();
});
