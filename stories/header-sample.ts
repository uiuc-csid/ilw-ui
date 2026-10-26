// Sample content shared by the Header stories and both sides of its parity pair.
import type { HeaderLink, HeaderNavItem } from '../src/svelte/Header.svelte';

export const parentUnit: HeaderLink = { label: 'Web Implementation Guidelines Group', href: '#wigg' };

export const utilityLinks: HeaderLink[] = [
  { label: 'Old Builder', href: '#old-builder' },
  { label: 'About Our Team', href: '#team' },
];

/** A disclosure menu: a link, a labelled section, a linked section with a nested section, and a link. */
export const menu: HeaderNavItem[] = [
  { label: 'About', href: '#about' },
  {
    label: 'Start Here',
    children: [
      { label: 'Getting Started', href: '#getting-started' },
      { label: 'Create a Page', href: '#create' },
      { label: 'Upgrade from V2', href: '#upgrade' },
    ],
  },
  {
    label: 'Information',
    href: '#information',
    children: [
      { label: 'Philosophy', href: '#philosophy', current: true },
      { label: 'Helpful Links', href: '#links' },
      {
        label: 'Garnet',
        href: '#garnet',
        children: [
          { label: 'Gneiss', href: '#gneiss' },
          { label: 'Peridotite', href: '#peridotite' },
        ],
      },
      {
        label: 'Smithsonite',
        children: [
          { label: 'Amphibole', href: '#amphibole' },
          { label: 'Pyroxene', href: '#pyroxene' },
        ],
      },
    ],
  },
  { label: 'Components', href: '#components' },
];

/** A megamenu: one flat list, one panel of columns, and a link. */
export const megamenu: HeaderNavItem[] = [
  {
    label: 'About',
    children: [
      { label: 'Directory', href: '#directory' },
      { label: 'Departments', href: '#departments' },
      { label: 'News', href: '#news' },
      { label: 'Events', href: '#events' },
      { label: 'Careers', href: '#careers' },
      { label: 'Contact', href: '#contact' },
      { label: 'Visit', href: '#visit' },
    ],
  },
  {
    label: 'Admissions',
    children: [
      {
        label: 'Undergraduate Admissions',
        href: '#ug',
        children: [
          { label: 'Apply', href: '#ug-apply' },
          { label: 'Majors', href: '#ug-majors' },
          { label: 'Cost and Aid', href: '#ug-cost' },
        ],
      },
      {
        label: 'Graduate Admissions',
        href: '#grad',
        children: [
          { label: 'Programs', href: '#grad-programs' },
          { label: 'Funding', href: '#grad-funding' },
        ],
      },
      {
        label: 'Online Programs',
        href: '#online',
        children: [
          { label: 'Degrees', href: '#online-degrees' },
          { label: 'Certificates', href: '#online-certificates' },
        ],
      },
    ],
  },
  { label: 'Research', href: '#research' },
];
