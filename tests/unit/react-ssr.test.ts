// Every module of ilw-ui/react and ilw-ui/svelte imports in node, so none
// touches the DOM at its top level (islands and static pages), and each
// presentational React component renders on the server, to the same markup as
// its Svelte twin's server render. One group per row of
// docs/plans/2026-10-27-react-components.md: a port adds its components'
// cases under its own comment.

import type { ReactElement } from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { type Component, createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';

import * as react from '../../src/react/index.ts';
import * as svelte from '../../src/svelte/index.ts';

/** Server markup without Svelte's hydration comments and the whitespace between tags. */
const markup = (html: string) => html.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').trim();

/** A Svelte snippet of fixed markup, the twin of a JSX child. */
const snippet = (html: string) => createRawSnippet(() => ({ render: () => html }));

/** A Svelte component's server markup, with its props type-checked. */
const ssr = <Props extends Record<string, unknown>>(component: Component<Props>, props: Props) => () =>
  render(component, { props }).body;

interface Case {
  name: string;
  react: ReactElement;
  /** The Svelte twin's server render. */
  svelte: () => string;
}

const cases: Case[] = [
  // R0d: the page shell
  { name: 'BackToTop', react: createElement(react.BackToTop), svelte: ssr(svelte.BackToTop, {}) },
  {
    name: 'BackToTop, own target and label',
    react: createElement(react.BackToTop, { target: 'shell', label: 'Top of page' }),
    svelte: ssr(svelte.BackToTop, { target: 'shell', label: 'Top of page' }),
  },
  {
    name: 'Page',
    react: createElement(react.Page, null, createElement('p', null, 'Content')),
    svelte: ssr(svelte.Page, { children: snippet('<p>Content</p>') }),
  },
  {
    name: 'Page, every option',
    react: createElement(
      react.Page,
      {
        skipLinkText: 'Skip to content',
        mainId: 'content',
        id: 'shell',
        format: true,
        margin: true,
        expanded: true,
        backToTop: true,
        className: 'app-page',
        header: createElement('header', null, 'Header'),
        footer: createElement('footer', null, 'Footer'),
      },
      createElement('p', null, 'Content'),
    ),
    svelte: ssr(svelte.Page, {
      skipLinkText: 'Skip to content',
      mainId: 'content',
      id: 'shell',
      format: true,
      margin: true,
      expanded: true,
      backToTop: true,
      class: 'app-page',
      header: snippet('<header>Header</header>'),
      footer: snippet('<footer>Footer</footer>'),
      children: snippet('<p>Content</p>'),
    }),
  },

  // R1 layout, Button, Icon, CopyButton

  // R1 page chrome

  // R2 forms

  // R3 islands and header

  // R4 modal

  // R5 data

  // R6 Zag

  // R7 select enhancement

  // R8 tabs

  // R9 tooltip

  // R10 accordion

  // R11 alert

  // R12 toggle group
];

describe('presentational components render on the server like their Svelte twins', () => {
  it.each(cases)('$name', ({ react: element, svelte: twin }) => {
    expect(markup(renderToStaticMarkup(element))).toBe(markup(twin()));
  });
});
