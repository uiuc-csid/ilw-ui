// The popover stories' controls and viewports, shared by the Svelte and React twins.

import { PLACEMENTS } from './plays/popover.ts';

/** The filters popover's props, as controls; the plays assume these defaults. */
export const args = { label: 'Filters', placement: 'bottom-left' } as const;

export const argTypes = {
  label: { control: 'text' as const, description: "The filters button's text" },
  placement: { control: 'select', options: PLACEMENTS, description: 'Where the filters panel sits against its button' },
  open: { control: false, description: 'Opens the filters panel when the story loads' },
} as const;

/** The viewport toolbar's sizes: a phone, a tablet, and a laptop. */
export const viewport = {
  options: {
    phone: { name: 'Phone (375 × 667)', styles: { width: '375px', height: '667px' }, type: 'mobile' },
    tablet: { name: 'Tablet (768 × 1024)', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
    laptop: { name: 'Laptop (1280 × 800)', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
  },
};
