import { expect, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

const STORY = 'components-togglegroup--fixture';

test('every enabled button is a Tab stop; Space and Enter toggle and keep focus', async ({ page }) => {
  await openStory(page, STORY);
  const level = page.getByRole('group', { name: 'Level' });
  const offered = page.getByRole('group', { name: 'Offered' });

  await press(page, 'Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();

  // Plain Tab stops, in order, across both groups; the disabled Winter is skipped.
  const order = [
    level.getByRole('button', { name: 'All' }),
    level.getByRole('button', { name: '100–299' }),
    level.getByRole('button', { name: '300–499' }),
    level.getByRole('button', { name: '500+' }),
    offered.getByRole('button', { name: 'Fall' }),
    offered.getByRole('button', { name: 'Spring' }),
    offered.getByRole('button', { name: 'Summer' }),
  ];
  for (const button of order) {
    await press(page, 'Tab');
    await expect(button).toBeFocused();
  }

  // Multiple: Space presses Summer and releases it again; focus stays.
  const summer = offered.getByRole('button', { name: 'Summer' });
  await press(page, 'Space');
  await expect(summer).toHaveAttribute('aria-pressed', 'true');
  await expect(summer).toBeFocused();
  await expect(page.getByTestId('count')).toHaveText('Showing 2 of 9 courses');
  await press(page, 'Enter');
  await expect(summer).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByTestId('terms')).toHaveText('');

  // Back into the single-select row: Enter moves the press.
  await press(page, 'Shift+Tab');
  await press(page, 'Shift+Tab');
  await press(page, 'Shift+Tab');
  const top = level.getByRole('button', { name: '500+' });
  await expect(top).toBeFocused();
  await press(page, 'Enter');
  await expect(top).toHaveAttribute('aria-pressed', 'true');
  await expect(level.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
  await expect(top).toBeFocused();
  // Pressing the pressed button keeps it pressed (no allowNone).
  await press(page, 'Space');
  await expect(top).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('level')).toHaveText('500');
});
