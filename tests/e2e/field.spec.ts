import { expect, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

const STORY = 'forms-field--fixture';

test('Tab reaches the controls in order; Space toggles the checkbox and the switch', async ({ page }) => {
  await openStory(page, STORY);
  const name = page.getByRole('textbox', { name: 'Name' });
  const box = page.getByRole('checkbox', { name: 'Email me updates' });
  const toggle = page.getByRole('switch', { name: 'Show weekends' });

  await press(page, 'Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await press(page, 'Tab');
  await expect(name).toBeFocused();
  await press(page, 'Tab');
  await expect(box).toBeFocused();

  await press(page, 'Space');
  await expect(box).toBeChecked();
  await press(page, 'Space');
  await expect(box).not.toBeChecked();

  await press(page, 'Tab');
  await expect(toggle).toBeFocused();
  await expect(toggle).not.toBeChecked();
  await press(page, 'Space');
  await expect(toggle).toBeChecked();
  await expect(toggle).toBeFocused();
  await press(page, 'Space');
  await expect(toggle).not.toBeChecked();

  // The radio group is one tab stop, on its checked option.
  await press(page, 'Tab');
  await expect(page.getByRole('radio', { name: 'Fall' })).toBeFocused();
  await press(page, 'Tab');
  await expect(page.getByRole('textbox', { name: 'Course' })).toBeFocused();
  await press(page, 'Shift+Tab');
  await expect(page.getByRole('radio', { name: 'Fall' })).toBeFocused();
});

test('arrow keys move through the radio group', async ({ page }) => {
  await openStory(page, STORY);
  const group = page.getByRole('group', { name: 'Term' });
  await group.getByRole('radio', { name: 'Fall' }).focus();

  await press(page, 'ArrowDown');
  await expect(group.getByRole('radio', { name: 'Spring' })).toBeFocused();
  await expect(group.getByRole('radio', { name: 'Spring' })).toBeChecked();
  await press(page, 'ArrowDown');
  await expect(group.getByRole('radio', { name: 'Summer' })).toBeChecked();
  await press(page, 'ArrowUp');
  await expect(group.getByRole('radio', { name: 'Spring' })).toBeChecked();
  await expect(group.getByRole('radio', { name: 'Fall' })).not.toBeChecked();
});

test('the compact layout is a block under 800px', async ({ page }) => {
  await openStory(page, STORY);
  const entry = page.locator('.ilw-input-entry-compact');
  await expect(entry).toHaveCSS('display', 'grid');
  await page.setViewportSize({ width: 600, height: 800 });
  await expect(entry).toHaveCSS('display', 'block');
  const label = await entry.locator('label').boundingBox();
  const input = await page.getByRole('textbox', { name: 'Course' }).boundingBox();
  expect(label!.y + label!.height).toBeLessThanOrEqual(input!.y + 1);
});
