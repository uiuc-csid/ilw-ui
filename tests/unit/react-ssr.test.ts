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

/** React's server markup without the image preload hints it writes before an `<img>` (a page's render hoists them into <head>). */
const reactMarkup = (element: ReactElement) =>
  renderToStaticMarkup(element).replace(/<link rel="preload" as="image"[^>]*>/g, '');

/** A Svelte component's server markup, with its props type-checked. */
const ssr = <Props extends Record<string, unknown>>(component: Component<Props>, props: Props) => () =>
  render(component, { props }).body;

/** A section tree with the current page in a nested branch, and a closed branch. */
const sectionNavItems = [
  { label: 'Programs', href: '/programs' },
  {
    label: 'Undergraduate',
    href: '/ug',
    children: [{ label: 'Majors', href: '/ug/majors', current: true }],
  },
  { label: 'Graduate', href: '/grad', children: [{ label: 'PhD', href: '/grad/phd' }] },
];

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
  {
    name: 'Breadcrumbs',
    react: createElement(react.Breadcrumbs, { items: [{ label: 'Home', href: '/' }], current: 'Programs' }),
    svelte: ssr(svelte.Breadcrumbs, { items: [{ label: 'Home', href: '/' }], current: 'Programs' }),
  },
  {
    name: 'Breadcrumbs, label, width and class',
    react: createElement(react.Breadcrumbs, {
      items: [
        { label: 'Home', href: '/' },
        { label: 'Academics', href: '/academics' },
      ],
      current: 'Programs',
      label: 'You are here',
      width: 'full',
      className: 'ilw-theme-blue-1',
    }),
    svelte: ssr(svelte.Breadcrumbs, {
      items: [
        { label: 'Home', href: '/' },
        { label: 'Academics', href: '/academics' },
      ],
      current: 'Programs',
      label: 'You are here',
      width: 'full',
      class: 'ilw-theme-blue-1',
    }),
  },
  {
    name: 'PageTitle',
    react: createElement(react.PageTitle, { children: 'Programs' }),
    svelte: ssr(svelte.PageTitle, { children: snippet('Programs') }),
  },
  {
    name: 'PageTitle, every option',
    react: createElement(react.PageTitle, {
      theme: 'orange',
      fade: true,
      image: '/title.jpg',
      width: 'page',
      className: 'app-title',
      children: 'Programs',
    }),
    svelte: ssr(svelte.PageTitle, {
      theme: 'orange',
      fade: true,
      image: '/title.jpg',
      width: 'page',
      class: 'app-title',
      children: snippet('Programs'),
    }),
  },
  {
    name: 'SectionNav',
    react: createElement(react.SectionNav, { items: sectionNavItems, id: 'programs' }),
    svelte: ssr(svelte.SectionNav, { items: sectionNavItems, id: 'programs' }),
  },
  {
    name: 'SectionNav, every option',
    react: createElement(react.SectionNav, {
      items: sectionNavItems,
      id: 'programs',
      label: 'In this section',
      root: false,
      open: true,
      expanded: true,
      className: 'app-nav',
    }),
    svelte: ssr(svelte.SectionNav, {
      items: sectionNavItems,
      id: 'programs',
      label: 'In this section',
      root: false,
      open: true,
      expanded: true,
      class: 'app-nav',
    }),
  },
  {
    name: 'Footer',
    react: createElement(react.Footer, { siteName: 'Sample Site' }),
    svelte: ssr(svelte.Footer, { siteName: snippet('Sample Site') }),
  },
  {
    name: 'Footer, every slot',
    react: createElement(
      react.Footer,
      {
        source: 'app',
        legalLinks: [{ label: 'Terms', href: '/terms' }],
        cookiesButton: true,
        socialLabel: 'Follow us',
        siteName: createElement('a', { href: '/' }, 'Sample Site'),
        primaryUnit: createElement('a', { href: '/unit' }, 'Unit'),
        address: createElement('p', null, 'Urbana, IL'),
        social: createElement('li', null, createElement('a', { href: '/social' }, 'Social')),
        actions: createElement('a', { href: '/give' }, 'Give'),
      },
      createElement('p', null, 'Content'),
    ),
    svelte: ssr(svelte.Footer, {
      source: 'app',
      legalLinks: [{ label: 'Terms', href: '/terms' }],
      cookiesButton: true,
      socialLabel: 'Follow us',
      siteName: snippet('<a href="/">Sample Site</a>'),
      primaryUnit: snippet('<a href="/unit">Unit</a>'),
      address: snippet('<p>Urbana, IL</p>'),
      social: snippet('<li><a href="/social">Social</a></li>'),
      actions: snippet('<a href="/give">Give</a>'),
      children: snippet('<p>Content</p>'),
    }),
  },
  {
    name: 'Pagination',
    react: createElement(react.Pagination, { page: 6, pages: 12, url: '/courses?term=fa26' }),
    svelte: ssr(svelte.Pagination, { page: 6, pages: 12, url: '/courses?term=fa26' }),
  },
  {
    name: 'Pagination, first page, href and options',
    react: createElement(react.Pagination, {
      page: 1,
      pages: 4,
      href: (p: number) => `#page-${p}`,
      label: 'Results pages',
      hidePageCount: true,
      className: 'ilw-theme-blue-1',
    }),
    svelte: ssr(svelte.Pagination, {
      page: 1,
      pages: 4,
      href: (p: number) => `#page-${p}`,
      label: 'Results pages',
      hidePageCount: true,
      class: 'ilw-theme-blue-1',
    }),
  },
  {
    name: 'SortableTh, unsorted',
    react: createElement(react.SortableTh, { sortKey: 'name', label: 'Name', sort: { key: 'hours', dir: 1 }, onSort: () => {} }),
    svelte: ssr(svelte.SortableTh, { key: 'name', label: 'Name', sort: { key: 'hours', dir: 1 }, onsort: () => {} }),
  },
  {
    name: 'SortableTh, descending',
    react: createElement(react.SortableTh, { sortKey: 'name', label: 'Name', sort: { key: 'name', dir: -1 }, onSort: () => {} }),
    svelte: ssr(svelte.SortableTh, { key: 'name', label: 'Name', sort: { key: 'name', dir: -1 }, onsort: () => {} }),
  },

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
    expect(markup(reactMarkup(element))).toBe(markup(twin()));
  });
});
