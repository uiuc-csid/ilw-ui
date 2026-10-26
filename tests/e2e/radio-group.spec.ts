import { expect, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

const STORY = 'forms-radiogroup--fixture';

test('Tab enters on the first option, Space checks it, arrows move and skip the disabled option', async ({ page }) => {
  await openStory(page, STORY);
  const group = page.getByRole('radiogroup', { name: 'Term' });
  const radio = (name: string) => group.getByRole('radio', { name });

  await press(page, 'Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await press(page, 'Tab');
  await expect(radio('Fall')).toBeFocused();
  await expect(radio('Fall')).not.toBeChecked();

  await press(page, 'Space');
  await expect(radio('Fall')).toBeChecked();
  await expect(page.getByTestId('chosen')).toHaveText('fa');

  await press(page, 'ArrowDown');
  await expect(radio('Spring')).toBeFocused();
  await expect(radio('Spring')).toBeChecked();
  // Summer is disabled: the arrow skips it.
  await press(page, 'ArrowDown');
  await expect(radio('Winter')).toBeChecked();
  await expect(page.getByTestId('chosen')).toHaveText('wi');
  // Back up, skipping Summer again. (Native radios wrap at the ends in
  // Chromium but not in WebKit, so the ends aren't tested.)
  await press(page, 'ArrowUp');
  await expect(radio('Spring')).toBeChecked();
  await expect(radio('Winter')).not.toBeChecked();

  // One tab stop: Tab leaves the group, Shift+Tab comes back to the checked option.
  await press(page, 'Tab');
  await expect(page.getByRole('textbox', { name: 'Course' })).toBeFocused();
  await press(page, 'Shift+Tab');
  await expect(radio('Spring')).toBeFocused();
});
