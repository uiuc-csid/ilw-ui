import { expect, test } from '@playwright/test';

import { openStory, press } from './focus.ts';

test('Enter and Space toggle the sort and keep focus on the heading button', async ({ page }) => {
  await openStory(page, 'sortableth--table');
  const nameTh = page.getByRole('columnheader', { name: 'Name' });
  const nameBtn = page.getByRole('button', { name: 'Name' });
  const hoursTh = page.getByRole('columnheader', { name: 'Hours' });
  const hoursBtn = page.getByRole('button', { name: 'Hours' });

  await press(page, 'Tab');
  await expect(nameBtn).toBeFocused();

  await press(page, 'Enter');
  await expect(nameTh).toHaveAttribute('aria-sort', 'descending');
  await expect(nameBtn).toBeFocused();

  await press(page, 'Space');
  await expect(nameTh).toHaveAttribute('aria-sort', 'ascending');
  await expect(nameBtn).toBeFocused();

  await press(page, 'Tab');
  await press(page, 'Tab');
  await expect(hoursBtn).toBeFocused();
  await press(page, 'Enter');
  await expect(hoursTh).toHaveAttribute('aria-sort', 'ascending');
  await expect(nameTh).not.toHaveAttribute('aria-sort');
  await expect(hoursBtn).toBeFocused();
});
