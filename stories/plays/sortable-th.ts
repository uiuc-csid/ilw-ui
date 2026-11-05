// Play functions for the SortableTh stories, shared by the Svelte and React twins.

import type { Args, PlayFunctionContext, WebRenderer } from 'storybook/internal/types';
import { expect, type Mock } from 'storybook/test';

const NBSP = ' ';

/** The sort callback's spy: `onsort` in Svelte, `onSort` in React. */
const onSort = (args: Args) => (args.onsort ?? args.onSort) as Mock;

/** SortableTh → Unsorted: no `aria-sort`, no arrow, and a click calls the callback. */
export async function unsorted({ canvas, userEvent, args }: PlayFunctionContext<WebRenderer>) {
  const th = canvas.getByRole('columnheader');
  const button = canvas.getByRole('button', { name: 'Name' });
  await expect(th).toHaveAttribute('scope', 'col');
  await expect(th).not.toHaveAttribute('aria-sort');
  await expect(button).toHaveAttribute('type', 'button');
  await expect(button).toHaveAttribute('data-sort', 'name');
  await expect(button.className).toBe('th-sort');
  await expect(button.textContent).toBe('Name');
  await expect(button.querySelector('span')).toBeNull();
  await userEvent.click(button);
  await expect(onSort(args)).toHaveBeenCalledWith('name');
}

/** SortableTh → Ascending: `aria-sort`, the classes, and the hidden arrow. */
export async function ascending({ canvas }: PlayFunctionContext<WebRenderer>) {
  const th = canvas.getByRole('columnheader');
  const button = canvas.getByRole('button', { name: 'Name' });
  await expect(th).toHaveAttribute('aria-sort', 'ascending');
  await expect(button.className).toBe('th-sort on');
  await expect(button.textContent).toBe(`Name${NBSP}↑`);
  const spans = button.querySelectorAll('span');
  await expect(spans).toHaveLength(1);
  await expect(spans[0]).toHaveAttribute('aria-hidden', 'true');
  await expect(spans[0].textContent).toBe(`${NBSP}↑`);
}

/** SortableTh → Descending: the descending state. */
export async function descending({ canvas }: PlayFunctionContext<WebRenderer>) {
  const button = canvas.getByRole('button', { name: 'Name' });
  await expect(canvas.getByRole('columnheader')).toHaveAttribute('aria-sort', 'descending');
  await expect(button.className).toBe('th-sort on');
  await expect(button.textContent).toBe(`Name${NBSP}↓`);
  await expect(button.querySelector('span[aria-hidden="true"]')?.textContent).toBe(`${NBSP}↓`);
}

/** SortableTh → Click sorts: `nextSort` by mouse, with focus kept on the heading buttons. */
export async function clickSorts({ canvas, userEvent }: PlayFunctionContext<WebRenderer>) {
  const firstCells = () =>
    canvas
      .getAllByRole('row')
      .slice(1)
      .map((r) => r.firstElementChild?.textContent);
  const [nameTh, courseTh, hoursTh] = canvas.getAllByRole('columnheader');
  const nameBtn = canvas.getByRole('button', { name: 'Name' });
  const hoursBtn = canvas.getByRole('button', { name: 'Hours' });

  await expect(nameTh).toHaveAttribute('aria-sort', 'ascending');
  await expect(courseTh).not.toHaveAttribute('aria-sort');
  await expect(firstCells()).toEqual(['Avery', 'Blake', 'Casey']);

  await userEvent.click(nameBtn);
  await expect(nameTh).toHaveAttribute('aria-sort', 'descending');
  await expect(firstCells()).toEqual(['Casey', 'Blake', 'Avery']);
  await expect(nameBtn).toHaveFocus();
  await expect(nameBtn.isConnected).toBe(true);

  await userEvent.click(hoursBtn);
  await expect(nameTh).not.toHaveAttribute('aria-sort');
  await expect(nameBtn.className).toBe('th-sort');
  await expect(hoursTh).toHaveAttribute('aria-sort', 'ascending');
  await expect(hoursBtn.className).toBe('th-sort on');
  await expect(firstCells()).toEqual(['Blake', 'Casey', 'Avery']);
  await expect(hoursBtn).toHaveFocus();
}
