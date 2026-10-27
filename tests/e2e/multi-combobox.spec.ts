import { expect, type Page, test } from '@playwright/test';

import { expectFocusNotOnBody, openStory, press } from './focus.ts';

function parts(page: Page) {
  return {
    title: page.getByRole('textbox', { name: 'Title' }),
    input: page.getByRole('combobox', { name: 'Faculty mentors' }),
    notes: page.getByRole('textbox', { name: 'Notes' }),
    tokens: page.locator('.combobox-token-label'),
    remove: (name: string) => page.getByRole('button', { name: `Remove ${name}` }),
    posted: page.getByTestId('posted'),
  };
}

async function type(page: Page, text: string) {
  await page.keyboard.type(text);
  await expectFocusNotOnBody(page);
}

test('arrows and Enter add tokens; the text clears and focus stays', async ({ page }) => {
  await openStory(page, 'multicombobox--fixture');
  const { title, input, notes, tokens } = parts(page);

  await title.focus();
  await press(page, 'Tab');
  await expect(input).toBeFocused();
  await type(page, 'ad');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await press(page, 'ArrowDown');
  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'mentors-popup-opt-dadams');
  await press(page, 'Enter');
  await expect(tokens).toHaveText(['Drew Adams']);
  await expect(input).toHaveValue('');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(input).toBeFocused();

  await type(page, 'casey');
  await expect(input).toHaveAttribute('aria-activedescendant', 'mentors-popup-opt-cclark');
  await press(page, 'Enter');
  await expect(tokens).toHaveText(['Drew Adams', 'Casey Clark']);

  // Escape closes; Enter with nothing highlighted neither adds nor submits.
  await type(page, 'ad');
  await press(page, 'Escape');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(input).toBeFocused();
  await press(page, 'ArrowDown');
  await press(page, 'Escape');
  await press(page, 'Tab');
  await expect(notes).toBeFocused();
  await expect(tokens).toHaveText(['Drew Adams', 'Casey Clark']);
  await expect(parts(page).posted).toHaveText('');
});

test('Tab order runs through the remove buttons; arrows move between them', async ({ page }) => {
  await openStory(page, 'multicombobox--fixture-preselected');
  const { title, input, remove } = parts(page);

  await title.focus();
  await press(page, 'Tab');
  await expect(remove('Avery Adams')).toBeFocused();
  await press(page, 'Tab');
  await expect(remove('Blake Brown')).toBeFocused();
  await press(page, 'Tab');
  await expect(remove('Casey Clark')).toBeFocused();
  await press(page, 'Tab');
  await expect(input).toBeFocused();

  await press(page, 'Shift+Tab');
  await expect(remove('Casey Clark')).toBeFocused();
  await press(page, 'ArrowLeft');
  await expect(remove('Blake Brown')).toBeFocused();
  await press(page, 'ArrowLeft');
  await press(page, 'ArrowLeft');
  await expect(remove('Avery Adams')).toBeFocused();
  await press(page, 'ArrowRight');
  await press(page, 'ArrowRight');
  await press(page, 'ArrowRight');
  await expect(input).toBeFocused();
});

test('Backspace and Delete remove tokens; focus moves to a neighbour, then the input', async ({ page }) => {
  await openStory(page, 'multicombobox--fixture-preselected');
  const { input, tokens, remove } = parts(page);
  const hidden = page.locator('input[type="hidden"][name="mentors"]');

  await input.focus();
  await press(page, 'Backspace');
  await expect(remove('Casey Clark')).toBeFocused();
  await expect(tokens).toHaveCount(3);

  await press(page, 'ArrowLeft');
  await press(page, 'Delete');
  await expect(tokens).toHaveText(['Avery Adams', 'Casey Clark']);
  await expect(remove('Casey Clark')).toBeFocused();
  await expect(hidden).toHaveCount(2);

  await press(page, 'Enter');
  await expect(tokens).toHaveText(['Avery Adams']);
  await expect(remove('Avery Adams')).toBeFocused();
  await press(page, 'Space');
  await expect(tokens).toHaveCount(0);
  await expect(input).toBeFocused();
  await expect(hidden).toHaveCount(0);

  // Backspace with nothing selected edits the text as usual.
  await type(page, 'ab');
  await press(page, 'Backspace');
  await expect(input).toHaveValue('a');
  await expect(input).toBeFocused();
});

test('Backspace with text in the input deletes text, not tokens', async ({ page }) => {
  await openStory(page, 'multicombobox--fixture-preselected');
  const { input, tokens } = parts(page);

  await input.focus();
  await type(page, 'x');
  await press(page, 'Backspace');
  await expect(input).toHaveValue('');
  await expect(input).toBeFocused();
  await expect(tokens).toHaveCount(3);
});

test('async: a result is added by keyboard and the form posts every value', async ({ page }) => {
  await openStory(page, 'multicombobox--fixture-async');
  const { input, tokens, posted } = parts(page);

  await input.focus();
  await type(page, 'ad');
  await expect(page.getByRole('option')).toHaveText(['Avery Adams', 'Drew Adams']);
  await press(page, 'ArrowDown');
  await press(page, 'Enter');
  await type(page, 'clark');
  await expect(input).toHaveAttribute('aria-activedescendant', 'mentors-popup-opt-cclark');
  await press(page, 'Enter');
  await expect(tokens).toHaveText(['Avery Adams', 'Casey Clark']);

  await press(page, 'Tab');
  await press(page, 'Tab');
  await expect(page.getByRole('button', { name: 'Post opportunity' })).toBeFocused();
  await press(page, 'Enter');
  await expect(posted).toHaveText('title=Soil+microbiome+survey&mentors=aadams&mentors=cclark&notes=');
});
