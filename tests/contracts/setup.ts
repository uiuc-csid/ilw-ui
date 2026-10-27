// Vitest setup for the storybook-* projects: after each story's render, play
// and axe check, writes its normalized DOM to stories/contracts/<story-id>.html
// (or compares it there). Every framework and browser compares against the same
// file, so it is the story's DOM contract.

import { afterEach, beforeEach, inject } from 'vitest';

import { normalize, PLATFORM_ONLY } from './normalize.ts';

declare module 'vitest' {
  export interface ProvidedContext {
    /** Absolute path of stories/contracts/. */
    contractsDir: string;
  }
}

// Besides its canvas, a story can add these to <body>: a modal, a popover, a live region.
const OUTSIDE = 'dialog, [popover], [aria-live], [role="status"], [role="alert"], [role="log"]';

let before = new Set<Element>();

beforeEach(() => {
  // announce()'s regions outlive the story that made them; without this, a story's
  // contract would depend on whether an earlier story announced something. A removed
  // region is made again on the next announce().
  for (const region of document.querySelectorAll('body > [data-ilw-announce]')) region.remove();
  // The previous story's canvas is still here: Storybook removes it when the next story starts.
  before = new Set(document.body.children);
});

// @storybook/addon-vitest puts the story id in the test's meta and the composed story on its context.
type StoryTest = { task: { meta: { storyId?: string } }; story?: { parameters: { contract?: boolean } } };

afterEach(async (context) => {
  const { task, expect } = context;
  const { story, task: { meta: { storyId } } } = context as unknown as StoryTest;
  if (!storyId || task.result?.state !== 'pass') return;
  // Parity Toolkit stories render the toolkit's markup, not ours.
  if (/^parity-.*--toolkit$/.test(storyId)) return;
  // `parameters.contract = false` opts out (with a comment giving the reason and an issue link).
  if (story?.parameters.contract === false) return;

  // Let effects and the frames they queue (announce(), Zag's deferred work) settle.
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  // Storybook's own (the a11y addon's vision filters) and Zag's Apple-only announcer aren't the story's.
  const added = [...document.body.children].filter(
    (el) => !before.has(el) && !el.id.startsWith('storybook-') && !el.matches(PLATFORM_ONLY),
  );
  const outside = added.filter((el) => el.matches(OUTSIDE));
  const canvases = added.filter((el) => !el.matches(OUTSIDE));
  expect(canvases, `${storyId}: expected one canvas among the elements the story added to <body>`).toHaveLength(1);

  await expect(normalize(canvases[0], outside)).toMatchFileSnapshot(`${inject('contractsDir')}/${storyId}.html`);
});
