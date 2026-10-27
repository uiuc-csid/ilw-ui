import { expect, type Locator, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

const STORY = 'forms-choicechips--fixture';
const ALTGELD = 'rgb(200, 65, 19)';

/** The focus ring is drawn on the chip (the input's label), not the input. */
async function expectRing(input: Locator): Promise<void> {
  const chip = input.locator('xpath=..');
  await expect(chip).toHaveCSS('outline-style', 'solid');
  await expect(chip).toHaveCSS('outline-width', '3px');
  await expect(chip).toHaveCSS('outline-color', ALTGELD);
}

test('radio chips: one tab stop, Space checks, arrows move and skip the disabled chip', async ({ page }) => {
  await openStory(page, STORY);
  const group = page.getByRole('radiogroup', { name: 'Country' });
  const radio = (name: string) => group.getByRole('radio', { name });

  await press(page, 'Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await press(page, 'Tab');
  await expect(radio('United States')).toBeFocused();
  await expect(radio('United States')).not.toBeChecked();
  await expectRing(radio('United States'));

  await press(page, 'Space');
  await expect(radio('United States')).toBeChecked();
  await expect(page.getByTestId('chosen').first()).toHaveText('us');

  await press(page, 'ArrowRight');
  await expect(radio('Canada')).toBeFocused();
  await expect(radio('Canada')).toBeChecked();
  await expect(radio('United States')).not.toBeChecked();
  await expectRing(radio('Canada'));
  await expect(radio('United States').locator('xpath=..')).toHaveCSS('outline-style', 'none');

  await press(page, 'ArrowDown');
  await press(page, 'ArrowDown');
  await press(page, 'ArrowDown');
  await expect(radio('China')).toBeChecked();
  // South Korea is disabled: the arrow skips it. (Native radios wrap at the
  // ends in Chromium but not in WebKit, so the ends aren't tested.)
  await press(page, 'ArrowLeft');
  await expect(radio('India')).toBeFocused();
  await expect(radio('India')).toBeChecked();
  await expect(page.getByTestId('chosen').first()).toHaveText('in');

  // Tab leaves the group; Shift+Tab comes back to the checked chip.
  await press(page, 'Tab');
  await expect(page.getByRole('checkbox', { name: 'Courses' })).toBeFocused();
  await press(page, 'Shift+Tab');
  await expect(radio('India')).toBeFocused();
});

test('checkbox chips: each is a tab stop and Space toggles it', async ({ page }) => {
  await openStory(page, STORY);
  const group = page.getByRole('group', { name: 'Tables to export' });
  const box = (name: string) => group.getByRole('checkbox', { name });
  const chosen = page.getByTestId('chosen').nth(1);

  await group.page().getByRole('radio', { name: 'United States' }).focus();
  await press(page, 'Tab');
  await expect(box('Courses')).toBeFocused();
  await expectRing(box('Courses'));
  await press(page, 'Space');
  await expect(box('Courses')).toBeChecked();

  await press(page, 'Tab');
  await expect(box('Sections')).toBeFocused();
  await press(page, 'Space');
  await expect(chosen).toHaveText('course, section');

  // Arrows don't move between checkboxes.
  await press(page, 'ArrowRight');
  await expect(box('Sections')).toBeFocused();

  await press(page, 'Shift+Tab');
  await expect(box('Courses')).toBeFocused();
  await press(page, 'Space');
  await expect(box('Courses')).not.toBeChecked();
  await expect(chosen).toHaveText('section');

  await press(page, 'Tab');
  await press(page, 'Tab');
  await expect(box('Instructors')).toBeFocused();
  await press(page, 'Tab');
  await expect(page.getByRole('textbox', { name: 'File name' })).toBeFocused();
});
