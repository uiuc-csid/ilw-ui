import { expect, type Page, test } from '@playwright/test';

import { expectFocusNotOnBody, framesSettled, openStory, press, slowFrames } from './focus.ts';

function parts(page: Page) {
  return {
    before: page.getByRole('textbox', { name: 'Before' }),
    input: page.getByRole('combobox', { name: 'Professor' }),
    after: page.getByRole('textbox', { name: 'After' }),
    text: page.getByTestId('text'),
    chosen: page.getByTestId('chosen'),
    submits: page.getByTestId('submits'),
  };
}

async function type(page: Page, text: string) {
  await page.keyboard.type(text);
  await expectFocusNotOnBody(page);
}

test('typing opens at one character; arrows move and wrap; Enter writes the suggestion', async ({ page }) => {
  await openStory(page, 'autocomplete--fixture');
  const { before, input, chosen } = parts(page);

  await before.focus();
  await press(page, 'Tab');
  await expect(input).toBeFocused();
  await type(page, 'a');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await type(page, 'dams');
  await expect(page.getByRole('option')).toHaveText(['A. Adams — Avery Adams (aadams)', 'D. Adams — Drew Adams (dadams)']);
  await expect(input).not.toHaveAttribute('aria-activedescendant');

  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'prof-popup-opt-aadams');
  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'prof-popup-opt-dadams');
  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'prof-popup-opt-aadams');
  await press(page, 'ArrowUp');
  await expect(input).toHaveAttribute('aria-activedescendant', 'prof-popup-opt-dadams');

  await press(page, 'Enter');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(input).toHaveValue('D. Adams');
  await expect(chosen).toHaveText('dadams');
  await expect(input).toBeFocused();
});

test('Escape closes, keeps focus and keeps the text', async ({ page }) => {
  await openStory(page, 'autocomplete--fixture');
  const { input } = parts(page);

  await input.focus();
  await type(page, 'adams');
  await press(page, 'ArrowDown');
  await press(page, 'Escape');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#prof-popup')).toBeHidden();
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('adams');
  // ArrowDown reopens on the current text.
  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('option')).toHaveCount(2);
});

test('Tab takes the highlighted suggestion and moves on; Shift+Tab comes back', async ({ page }) => {
  await openStory(page, 'autocomplete--fixture');
  const { before, input, after, chosen } = parts(page);

  await input.focus();
  await type(page, 'brown');
  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'prof-popup-opt-bbrown');
  await press(page, 'Tab');
  await expect(after).toBeFocused();
  await expect(input).toHaveValue('B. Brown');
  await expect(chosen).toHaveText('bbrown');
  await expect(input).toHaveAttribute('aria-expanded', 'false');

  await press(page, 'Shift+Tab');
  await expect(input).toBeFocused();
  await press(page, 'Shift+Tab');
  await expect(before).toBeFocused();
});

test('Tab before Zag\'s deferred focus lands still moves on', async ({ page }) => {
  // Opening the list queues a focus on the input for the next frame; a Tab
  // inside that frame was pulled back.
  await slowFrames(page);
  await openStory(page, 'autocomplete--fixture');
  const { input, after } = parts(page);

  await input.focus();
  await type(page, 'brown');
  await press(page, 'Tab');
  await framesSettled(page);
  await expectFocusNotOnBody(page);
  await expect(after).toBeFocused();
});

test('free text stays on Tab, and Enter with nothing highlighted submits the form', async ({ page }) => {
  await openStory(page, 'autocomplete--fixture');
  const { input, after, text, chosen, submits } = parts(page);

  await input.focus();
  await type(page, 'adams');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await press(page, 'Tab');
  await expect(after).toBeFocused();
  await expect(input).toHaveValue('adams');
  await expect(text).toHaveText('adams');
  await expect(chosen).toHaveText('');

  // A free-text field: Enter without a highlight is the input's own.
  await press(page, 'Shift+Tab');
  await press(page, 'Enter');
  await expect(submits).toHaveText('1');
  await expect(input).toHaveValue('adams');
});

test('"No matches" is not selectable', async ({ page }) => {
  await openStory(page, 'autocomplete--fixture-empty-text');
  const { input, chosen } = parts(page);

  await input.focus();
  await type(page, 'zz');
  await expect(page.getByRole('option', { name: 'No matches' })).toBeVisible();
  await press(page, 'ArrowDown');
  await expect(input).not.toHaveAttribute('aria-activedescendant');
  await press(page, 'Tab');
  await expect(input).toHaveValue('zz');
  await expect(chosen).toHaveText('');
});

test('a click on a suggestion writes it and keeps focus in the input', async ({ page }) => {
  await openStory(page, 'autocomplete--fixture');
  const { input, chosen } = parts(page);

  await input.focus();
  await type(page, 'clark');
  await page.getByRole('option', { name: 'C. Clark — Casey Clark (cclark)' }).click();
  await expect(input).toHaveValue('C. Clark');
  await expect(chosen).toHaveText('cclark');
  await expect(input).toBeFocused();
});

test('typing mid-text keeps the caret in place', async ({ page }) => {
  await openStory(page, 'autocomplete--fixture');
  const { input } = parts(page);
  const caret = () => input.evaluate((el: HTMLInputElement) => el.selectionStart);

  await input.focus();
  // Storybook's user-event wraps the value setter on focus (see combobox.spec.ts).
  await input.evaluate((el) => {
    for (const key of Object.getOwnPropertyNames(el)) {
      if (key !== 'setSelectionRange' && !key.startsWith('__')) delete (el as unknown as Record<string, unknown>)[key];
    }
  });
  await type(page, 'ams');
  await press(page, 'Escape');
  for (let i = 0; i < 3; i++) await press(page, 'ArrowLeft');
  await type(page, 'ad');
  await expect(input).toHaveValue('adams');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect.poll(caret).toBe(2);
});

test('no live region is left on <body> while the list is in use', async ({ page }) => {
  await openStory(page, 'autocomplete--fixture');
  const { input } = parts(page);

  await input.focus();
  await type(page, 'ad');
  await press(page, 'ArrowDown');
  await press(page, 'ArrowDown');
  // Zag announces through it on macOS/iOS only; elsewhere there is none at all.
  await expect(page.locator('body > [data-live-announcer]')).toHaveCount(0);
});

test('async: suggestions arrive after a pause; Enter writes one; Tab moves on', async ({ page }) => {
  await openStory(page, 'autocomplete--fixture-async');
  const { input, after, chosen } = parts(page);

  await input.focus();
  await type(page, 'ad');
  await expect(page.getByRole('option')).toHaveText(['A. Adams — Avery Adams (aadams)', 'D. Adams — Drew Adams (dadams)']);
  await expect(input).not.toHaveAttribute('aria-activedescendant');
  await expect(page.locator('.autocomplete > [role="status"]')).toHaveText('2 results');
  await press(page, 'ArrowDown');
  await expect(input).toHaveAttribute('aria-activedescendant', 'prof-popup-opt-aadams');
  await press(page, 'Enter');
  await expect(input).toHaveValue('A. Adams');
  await expect(chosen).toHaveText('aadams');
  await press(page, 'Tab');
  await expect(after).toBeFocused();
  await expect(input).toHaveValue('A. Adams');
});
