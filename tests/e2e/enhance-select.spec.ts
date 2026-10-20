import { expect, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

test('an enhanced select: keyboard commit writes the select; Escape keeps focus', async ({ page }) => {
  await openStory(page, 'enhanceselect--fixture');
  const before = page.getByRole('textbox', { name: 'Before' });
  const input = page.getByRole('combobox', { name: 'Person' });
  const after = page.getByRole('textbox', { name: 'After' });
  const select = page.locator('#person');

  await before.focus();
  await press(page, 'Tab');
  await expect(input).toBeFocused();
  await page.keyboard.type('ad');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('group')).toHaveCount(2);
  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-aadams');
  await press(page, 'Escape');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(input).toBeFocused();

  // Wait for each step: WebKit can take the second ArrowDown before the list reopens.
  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-aadams');
  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-dadams');
  await press(page, 'Enter');
  await expect(select).toHaveValue('dadams');
  await expect(page.getByTestId('changes')).toHaveText('person=dadams');
  await expect(input).toBeFocused();

  await press(page, 'Tab');
  await expect(after).toBeFocused();
  await press(page, 'Shift+Tab');
  await expect(input).toBeFocused();
});
