import type { SectionNavItem } from '../src/core/section-nav.ts';

/** The toolkit README's example tree, with the current page two levels down. */
export const programs: SectionNavItem[] = [
  { label: 'Programs of Study', href: '#programs' },
  {
    label: 'Undergraduate Degrees',
    href: '#ug',
    children: [
      {
        label: 'Animal Sciences Major',
        href: '#animal-sciences',
        children: [
          { label: 'Pre-Veterinary and Medical', href: '#pre-vet', current: true },
          { label: 'Companion Animal Equine', href: '#equine' },
        ],
      },
    ],
  },
  { label: 'Computer & Animal Science', href: '#cs-animal', children: [{ label: 'Some Third Thing', href: '#third' }] },
];
