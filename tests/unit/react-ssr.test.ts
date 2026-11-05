// Every module of ilw-ui/react and ilw-ui/svelte imports in node, so none
// touches the DOM at its top level (islands and static pages), and each
// presentational React component renders on the server, to the same markup as
// its Svelte twin's server render. One group per row of
// docs/plans/2026-10-27-react-components.md: a port adds its components'
// cases under its own comment.

import { EnvelopeIcon } from '@phosphor-icons/react/dist/ssr/Envelope';
import Envelope from 'phosphor-svelte/lib/Envelope';
import type { ReactElement } from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { type Component, createRawSnippet } from 'svelte';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';

import * as react from '../../src/react/index.ts';
import * as svelte from '../../src/svelte/index.ts';

/**
 * A tag's attributes in name order, with `style` as its declarations, unspaced: the order
 * isn't markup (the DOM contracts sort them too), and React writes some later than given
 * (`name` on a button) or where its own props put them (Phosphor's svg).
 */
const sortAttributes = (attributes: string) =>
  [...attributes.matchAll(/\s+([^\s=>/]+)(?:="([^"]*)")?/g)]
    .map(([, name, value]) => {
      if (value === undefined) return name;
      if (name === 'style') {
        value = value
          .split(';')
          .map((d) => d.replace(/\s*:\s*/, ':').trim())
          .filter(Boolean)
          .sort()
          .join(';');
      }
      return `${name}="${value}"`;
    })
    .sort()
    .map((a) => ` ${a}`)
    .join('');

/** Server markup without Svelte's hydration comments and the whitespace between tags, attributes sorted. */
const markup = (html: string) =>
  html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/<([a-zA-Z][\w-]*)((?:\s+[^\s=>/]+(?:="[^"]*")?)*)\s*(\/?)>/g, (_, tag, attributes, slash) => `<${tag}${sortAttributes(attributes)}${slash}>`)
    .trim();

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
  {
    name: 'Button',
    react: createElement(react.Button, null, 'Save'),
    svelte: ssr(svelte.Button, { children: snippet('Save') }),
  },
  {
    name: 'Button, size, theme, class and attributes',
    react: createElement(react.Button, { size: 'large', theme: 'blue-solid', className: 'app-save', type: 'submit', name: 'save', children: 'Save' }),
    svelte: ssr(svelte.Button, { size: 'large', theme: 'blue-solid', class: 'app-save', type: 'submit', name: 'save', children: snippet('Save') }),
  },
  {
    name: 'Button, disabled',
    react: createElement(react.Button, { disabled: true, children: 'Save' }),
    svelte: ssr(svelte.Button, { disabled: true, children: snippet('Save') }),
  },
  {
    name: 'Button, link',
    react: createElement(react.Button, { href: '/apply', size: 'small', theme: 'orange', target: '_blank', children: 'Apply' }),
    svelte: ssr(svelte.Button, { href: '/apply', size: 'small', theme: 'orange', target: '_blank', children: snippet('Apply') }),
  },
  {
    name: 'Button, disabled link',
    react: createElement(react.Button, { href: '/apply', disabled: true, tabIndex: 0, children: 'Apply' }),
    svelte: ssr(svelte.Button, { href: '/apply', disabled: true, tabindex: 0, children: snippet('Apply') }),
  },
  {
    name: 'Icon',
    react: createElement(react.Icon, { icon: EnvelopeIcon }),
    svelte: ssr(svelte.Icon, { icon: Envelope }),
  },
  {
    name: 'Icon, labelled, line, sized',
    react: createElement(react.Icon, { icon: EnvelopeIcon, type: 'line', alt: 'Email', size: '2rem', className: 'app-icon' }),
    svelte: ssr(svelte.Icon, { icon: Envelope, type: 'line', alt: 'Email', size: '2rem', class: 'app-icon' }),
  },
  {
    name: 'Columns',
    react: createElement(react.Columns, null, createElement('div', null, 'One'), createElement('div', null, 'Two')),
    svelte: ssr(svelte.Columns, { children: snippet('<div>One</div><div>Two</div>') }),
  },
  {
    name: 'Columns, every option',
    react: createElement(react.Columns, {
      mode: '2x1',
      reverse: true,
      gap: '40px',
      theme: 'blue',
      width: 'auto',
      className: 'app-row',
      children: createElement('div', null, 'One'),
    }),
    svelte: ssr(svelte.Columns, {
      mode: '2x1',
      reverse: true,
      gap: '40px',
      theme: 'blue',
      width: 'auto',
      class: 'app-row',
      children: snippet('<div>One</div>'),
    }),
  },
  {
    name: 'Columns, sidebar',
    react: createElement(react.Columns, { mode: 'sidebar-right', children: createElement('div', null, 'One') }),
    svelte: ssr(svelte.Columns, { mode: 'sidebar-right', children: snippet('<div>One</div>') }),
  },
  {
    name: 'Content',
    react: createElement(react.Content, null, createElement('p', null, 'Prose')),
    svelte: ssr(svelte.Content, { children: snippet('<p>Prose</p>') }),
  },
  {
    name: 'Content, every option',
    react: createElement(react.Content, {
      mode: 'lede',
      align: 'center',
      decoration: true,
      transparent: true,
      theme: 'gray',
      width: 'full',
      className: 'app-box',
      children: createElement('p', null, 'Prose'),
    }),
    svelte: ssr(svelte.Content, {
      mode: 'lede',
      align: 'center',
      decoration: true,
      transparent: true,
      theme: 'gray',
      width: 'full',
      class: 'app-box',
      children: snippet('<p>Prose</p>'),
    }),
  },
  {
    name: 'Grid',
    react: createElement(react.Grid, null, createElement('li', null, 'Item')),
    svelte: ssr(svelte.Grid, { children: snippet('<li>Item</li>') }),
  },
  {
    name: 'Grid, every option',
    react: createElement(react.Grid, {
      as: 'div',
      itemWidth: '120px',
      gap: '20px',
      theme: 'orange',
      width: 'page',
      className: 'app-grid',
      children: createElement('div', null, 'Item'),
    }),
    svelte: ssr(svelte.Grid, {
      as: 'div',
      itemWidth: '120px',
      gap: '20px',
      theme: 'orange',
      width: 'page',
      class: 'app-grid',
      children: snippet('<div>Item</div>'),
    }),
  },
  { name: 'Spacer', react: createElement(react.Spacer), svelte: ssr(svelte.Spacer, {}) },
  {
    name: 'Spacer, height',
    react: createElement(react.Spacer, { height: '3rem' }),
    svelte: ssr(svelte.Spacer, { height: '3rem' }),
  },
  {
    name: 'CopyButton',
    react: createElement(react.CopyButton, { value: 'aturing2', label: 'Copy netid', hideLabel: true, size: 'small' }),
    svelte: ssr(svelte.CopyButton, { value: 'aturing2', label: 'Copy netid', hideLabel: true, size: 'small' }),
  },
  {
    name: 'CopyButton, by target',
    react: createElement(react.CopyButton, { target: 'share-link', theme: 'blue-solid', className: 'app-copy' }),
    svelte: ssr(svelte.CopyButton, { target: 'share-link', theme: 'blue-solid', class: 'app-copy' }),
  },

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
