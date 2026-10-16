import { expect, type Page, test } from '@playwright/test';

import { expectFocusNotOnBody, openStory, press } from './focus.ts';

function parts(page: Page) {
  return {
    before: page.getByRole('textbox', { name: 'Before' }),
    input: page.getByRole('combobox', { name: 'Person' }),
    after: page.getByRole('textbox', { name: 'After' }),
    selected: page.getByTestId('selected'),
  };
}

async function type(page: Page, text: string) {
  await page.keyboard.type(text);
  await expectFocusNotOnBody(page);
}

test('typing opens at two characters; arrows move and wrap; Enter commits', async ({ page }) => {
  await openStory(page, 'combobox--fixture');
  const { before, input, selected } = parts(page);

  await before.focus();
  await press(page, 'Tab');
  await expect(input).toBeFocused();
  await type(page, 'a');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await type(page, 'd');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('option')).toHaveText(['Avery Adams', 'Drew Adams']);
  await expect(input).not.toHaveAttribute('aria-activedescendant');

  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-aadams');
  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-dadams');
  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-aadams');
  await press(page, 'ArrowUp');
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-dadams');

  await press(page, 'Enter');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(input).toHaveValue('Drew Adams');
  await expect(selected).toHaveText('dadams');
  await expect(input).toBeFocused();
});

test('Alt+ArrowDown opens without highlighting; Escape closes and keeps focus', async ({ page }) => {
  await openStory(page, 'combobox--fixture');
  const { input } = parts(page);

  await input.focus();
  await press(page, 'Alt+ArrowDown');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('option')).toHaveCount(4);
  await expect(input).not.toHaveAttribute('aria-activedescendant');

  // ta-manager's legacy combobox dropped focus to <body> here.
  await press(page, 'Escape');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#person-popup')).toBeHidden();
  await expect(input).toBeFocused();
});

test('Tab commits a unique match and moves on; Shift+Tab comes back', async ({ page }) => {
  await openStory(page, 'combobox--fixture');
  const { before, input, after, selected } = parts(page);

  await input.focus();
  await type(page, 'blake');
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-bbrown');
  await press(page, 'Tab');
  await expect(after).toBeFocused();
  await expect(selected).toHaveText('bbrown');
  await expect(input).toHaveValue('Blake Brown');
  await expect(input).toHaveAttribute('aria-expanded', 'false');

  await press(page, 'Shift+Tab');
  await expect(input).toBeFocused();
  await press(page, 'Shift+Tab');
  await expect(before).toBeFocused();
});

test('unmatched text stays on Tab and commits nothing', async ({ page }) => {
  await openStory(page, 'combobox--fixture');
  const { input, after, selected } = parts(page);

  await input.focus();
  await type(page, 'adams');
  await press(page, 'Tab');
  await expect(after).toBeFocused();
  await expect(input).toHaveValue('adams');
  await expect(selected).toHaveText('');
  await expect(page.getByTestId('changes')).toHaveText('0');
});

test('ArrowDown on a selected value opens the whole list at the selection', async ({ page }) => {
  await openStory(page, 'combobox--fixture-preselected');
  const { input, selected } = parts(page);

  await expect(input).toHaveValue('Casey Clark');
  await input.focus();
  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('option')).toHaveCount(4);
  await expect(input).toHaveAttribute('aria-activedescendant', 'person-popup-opt-cclark');
  await press(page, 'ArrowDown');
  await press(page, 'Enter');
  await expect(selected).toHaveText('dadams');
  await expect(input).toHaveValue('Drew Adams');
});
