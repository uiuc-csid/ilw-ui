// Breadcrumbs (B4), rendering the markup documented in the README: a labelled
// nav with an ordered list of links, ending in the current page, unlinked and
// marked aria-current="page". Styled by breadcrumbs.css. The React twin of
// Breadcrumbs.svelte.

import { classNames } from '../core/class-names.ts';
import { type LayoutWidth, widthClass } from '../core/layout.ts';

export interface Crumb {
  label: string;
  href: string;
}

export interface BreadcrumbsProps {
  /** The trail from the site's home page, all linked. */
  items: Crumb[];
  /** The current page's title, shown last and not linked. */
  current: string;
  /** The navigation landmark's accessible name. */
  label?: string;
  /** Breaks out of the page margins (`full`, `auto`), or keeps to them (`page`). */
  width?: LayoutWidth;
  /** More classes on the nav, e.g. a theme class. */
  className?: string;
}

export function Breadcrumbs({ items, current, label = 'Breadcrumbs', width, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={classNames('ilw-breadcrumbs', widthClass(width), className)} aria-label={label}>
      <ol>
        {items.map((item, i) => (
          <li key={i}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
        <li>
          <span aria-current="page">{current}</span>
        </li>
      </ol>
    </nav>
  );
}
