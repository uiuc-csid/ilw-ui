<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { expect, spyOn, userEvent, within } from 'storybook/test';

  import { mountIslands } from '../src/svelte/islands.ts';
  import IslandCounter from './IslandCounter.svelte';
  import IslandsDemo from './IslandsDemo.svelte';

  const { Story } = defineMeta({
    title: 'mountIslands',
    parameters: { styles: 'ilw-ui' },
    // The Docs page lists every story with its review notes (the comment above it).
    tags: ['autodocs'],
    component: IslandsDemo,
  });

  const registry = { counter: IslandCounter };

  function hosts(canvasElement: HTMLElement) {
    return [...canvasElement.querySelectorAll<HTMLElement>('[data-ilw-island]')];
  }

  const pagehide = (persisted: boolean) => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted }));
</script>

<!--
  Server-rendered hosts, mounted.

  **Why:** static pages (Django and similar) render `<div data-ilw-island="name">` hosts and mount Svelte components on them. Props come inline (`data-props`) or from a `json_script` block (`data-props-id`), parsed with `JSON.parse` only, so a strict CSP holds. A host with bad JSON or an unknown name is logged and skipped, and never stops the others.

  **Review:** two counters, "Inline props: 2" and "From json_script: 5", each counting up when clicked. The other two hosts stay empty and the console shows one error for each.
-->
<Story
  name="Mounted"
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const error = spyOn(console, 'error').mockImplementation(() => {});
    try {
      const [inline, fromScript, bad, missing] = hosts(canvasElement);
      expect(() => mountIslands(registry, canvasElement)).not.toThrow();

      await expect(inline).toHaveAttribute('data-ilw-mounted');
      await expect(fromScript).toHaveAttribute('data-ilw-mounted');
      await expect(bad).not.toHaveAttribute('data-ilw-mounted');
      await expect(missing).not.toHaveAttribute('data-ilw-mounted');
      await expect(bad).toBeEmptyDOMElement();
      await expect(missing).toBeEmptyDOMElement();

      const button = canvas.getByRole('button', { name: 'Inline props: 2' });
      await expect(inline).toContainElement(button);
      await userEvent.click(button);
      await expect(button).toHaveTextContent('Inline props: 3');
      await expect(within(fromScript).getByRole('button')).toHaveTextContent('From json_script: 5');

      await expect(error).toHaveBeenCalledTimes(2);
      await expect(error.mock.calls[0][0]).toMatch(/bad props for "counter"/);
      await expect(error.mock.calls[1][0]).toMatch(/no component registered as "missing"/);

      // Again: nothing new to mount, and the bad hosts don't log twice.
      mountIslands(registry, canvasElement)();
      await expect(canvas.getAllByRole('button')).toHaveLength(2);
      await expect(error).toHaveBeenCalledTimes(2);
    } finally {
      error.mockRestore();
    }
  }}
/>

<!--
  A fragment swapped in after the first mount, then the page unloaded.

  **Why:** after an htmx-style swap, calling `mountIslands` again mounts only the new host. Each call's returned function unmounts only what that call mounted. A `pagehide` into the bfcache (`persisted: true`) leaves islands alone so the restored page still works; a real unload unmounts them.

  **Review:** three counters: the two server-rendered ones and "Swapped in: 0".
-->
<Story
  name="Fragment swap and pagehide"
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const error = spyOn(console, 'error').mockImplementation(() => {});
    try {
      const first = mountIslands(registry, canvasElement);
      await expect(canvas.getAllByRole('button')).toHaveLength(2);

      const swapped = document.createElement('div');
      swapped.dataset.ilwIsland = 'counter';
      swapped.dataset.props = JSON.stringify({ label: 'Swapped in' });
      canvasElement.querySelector('#islands')!.append(swapped);
      const second = mountIslands(registry, canvasElement);
      await expect(canvas.getAllByRole('button')).toHaveLength(3);
      await expect(within(swapped).getByRole('button')).toHaveTextContent('Swapped in: 0');

      // bfcache: nothing unmounts.
      pagehide(true);
      await expect(canvas.getAllByRole('button')).toHaveLength(3);

      // The second call's unmount takes only its own island, and allows a remount.
      second();
      await expect(swapped).toBeEmptyDOMElement();
      await expect(swapped).not.toHaveAttribute('data-ilw-mounted');
      await expect(canvas.getAllByRole('button')).toHaveLength(2);

      // A real unload unmounts the rest.
      pagehide(false);
      await expect(canvas.queryAllByRole('button')).toHaveLength(0);
      first(); // already torn down: a no-op

      // Leave the story showing the mounted page for review.
      mountIslands(registry, canvasElement);
      await expect(canvas.getAllByRole('button')).toHaveLength(3);
    } finally {
      error.mockRestore();
    }
  }}
/>
