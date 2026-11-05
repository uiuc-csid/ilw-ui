// An icon (A6), the replacement for <ilw-icon>: one Phosphor icon
// (https://phosphoricons.com) as inline SVG, sized by the font and coloured by
// currentColor as the toolkit's icon font is. Decorative unless it has `alt`.
// Styled by icon.css. The React twin of Icon.svelte.

import type { Icon as PhosphorIcon } from '@phosphor-icons/react';

import { classNames } from '../core/class-names.ts';

export interface IconProps {
  /** The icon: a Phosphor component from its server entry (`@phosphor-icons/react/dist/ssr/Calendar`). */
  icon: PhosphorIcon;
  /** The toolkit's `type`: `'solid'` is Phosphor's fill weight, `'line'` its regular weight. */
  type?: 'solid' | 'line';
  /** The icon's accessible name. Leave it empty when text next to the icon says the same thing. */
  alt?: string;
  /** A CSS length for the width and height. Unset, the icon is 1em: it follows the font size. */
  size?: string;
  /** More classes on the `<svg>`. */
  className?: string;
}

export function Icon({ icon: Glyph, type = 'solid', alt = '', size, className = '' }: IconProps) {
  // Phosphor's `alt` would render a <title>; the name goes in aria-label instead, as phosphor-svelte
  // renders it. The <rect> is the child phosphor-svelte draws before the paths.
  return (
    <Glyph
      weight={type === 'line' ? 'regular' : 'fill'}
      size={size ?? '1em'}
      className={classNames('ilw-icon', className)}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : 'true'}
    >
      <rect width="256" height="256" fill="none" />
    </Glyph>
  );
}
