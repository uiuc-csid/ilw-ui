// Grid (A5), rendering the markup documented in the README: a list (or div)
// laid out as many equal columns as fit. Styled by grid.css. The React twin of
// Grid.svelte.

import type { ReactNode } from 'react';

import { classNames } from '../core/class-names.ts';
import { type LayoutTheme, type LayoutWidth, widthClass } from '../core/layout.ts';
import { cssVars } from './css-vars.ts';

export interface GridProps {
  /** `ul` (the default, so screen readers announce the count) or `div`. */
  as?: 'ul' | 'div';
  /** The narrowest a column may be (the toolkit's `innerwidth`); unset is 250px. */
  itemWidth?: string;
  /** The gap between items; unset is 10px. */
  gap?: string;
  /** A theme for the background. */
  theme?: LayoutTheme;
  /** Breaks out of the page margins, or keeps to them. */
  width?: LayoutWidth;
  /** More classes on the grid. */
  className?: string;
  /** The items: `<li>`s in a `ul`, `<div>`s in a `div`. */
  children: ReactNode;
}

export function Grid({ as: Tag = 'ul', itemWidth, gap, theme, width, className = '', children }: GridProps) {
  // `theme` isn't a typed HTML attribute; tokens.css selects on it ([theme=blue]).
  const themeAttr = theme ? { theme } : {};

  return (
    <Tag
      className={classNames('ilw-grid', widthClass(width), className)}
      {...themeAttr}
      style={cssVars({ '--ilw-grid--item-width': itemWidth, '--ilw-grid--gap': gap })}
    >
      {children}
    </Tag>
  );
}
