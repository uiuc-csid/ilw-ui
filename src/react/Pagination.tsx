// Pagination (C5), rendering the markup documented in the README: links to the
// pages of a server-rendered list, the CSS form of <ilw-pagination>. The page
// list is Pager's (pageWindow: the first, the last and two either side of the
// current page), between Previous and Next, with "Page x of y" after it. The
// current page stays a link, marked aria-current="page"; Previous and Next on
// the first and last page are plain text. Styled by pagination.css. The React
// twin of Pagination.svelte.

import { classNames } from '../core/class-names.ts';
import { paginationModel } from '../core/pager.ts';

export interface PaginationProps {
  /** The current page, 1-based. */
  page: number;
  /** How many pages there are. */
  pages: number;
  /** The list's URL, relative or absolute; each link sets `parameter` in its query and keeps the rest. */
  url?: string;
  /** The query parameter holding the page number. */
  parameter?: string;
  /** Builds each page's link instead of `url` and `parameter`, e.g. for 0-based or path-based pages. */
  href?: (page: number) => string;
  /** The navigation landmark's accessible name; give two paginations on one page distinct names. */
  label?: string;
  /** Leave out "Page x of y". */
  hidePageCount?: boolean;
  /** More classes on the nav, e.g. a theme class. */
  className?: string;
}

export function Pagination({
  page,
  pages,
  url = '',
  parameter = 'page',
  href,
  label = 'Pages',
  hidePageCount = false,
  className = '',
}: PaginationProps) {
  const model = paginationModel({ page, pages, url, parameter, href });
  return (
    <nav className={classNames('ilw-pagination', className)} aria-label={label}>
      <ul>
        <li className="ilw-pagination-previous">
          {model.previous !== null ? (
            <a href={model.previous} aria-label="Previous page">
              Previous
            </a>
          ) : (
            <span>Previous</span>
          )}
        </li>
        {model.pages.map((p, i) =>
          p === null ? (
            <li key={`gap-${i}`} className="ilw-pagination-ellipsis">
              <span>…</span>
            </li>
          ) : (
            <li key={p.page}>
              <a href={p.href} aria-label={`Page ${p.page}`} aria-current={p.current ? 'page' : undefined}>
                {p.page}
              </a>
            </li>
          ),
        )}
        <li className="ilw-pagination-next">
          {model.next !== null ? (
            <a href={model.next} aria-label="Next page">
              Next
            </a>
          ) : (
            <span>Next</span>
          )}
        </li>
      </ul>
      {!hidePageCount && (
        <span className="ilw-pagination-count">
          Page {model.current} of {model.total}
        </span>
      )}
    </nav>
  );
}
