// The page arithmetic behind Pager (page buttons for a paged createDataTable
// table) and Pagination (links to a server-rendered list's pages).

import { pageHref, pageWindow } from './table.ts';

/** What `Pager` renders. */
export interface PagerModel {
  /** The current page, 1-based, clamped to the pages there are. */
  page: number;
  /** How many pages there are; at least 1. */
  totalPages: number;
  /** "first–last of total", or the empty label when no row passes the filters. */
  count: string;
  /** The page window: page numbers, with null for a gap. */
  pages: Array<number | null>;
}

/** `Pager`'s page, page count, count text and page window for a table's pagination state. */
export function pagerModel({
  pageIndex,
  pageSize,
  total,
  emptyLabel,
}: {
  pageIndex: number;
  pageSize: number;
  /** Rows passing the filters, before pagination. */
  total: number;
  emptyLabel: string;
}): PagerModel {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(pageIndex + 1, totalPages);
  const first = (page - 1) * pageSize;
  const count = total === 0 ? emptyLabel : `${first + 1}–${Math.min(first + pageSize, total)} of ${total}`;
  return { page, totalPages, count, pages: pageWindow(page, totalPages) };
}

/** A page link in `Pagination`'s window. */
export interface PaginationPage {
  page: number;
  href: string;
  /** The current page, marked `aria-current="page"`. */
  current: boolean;
}

/** What `Pagination` renders. */
export interface PaginationModel {
  /** The current page, clamped to 1…`total`. */
  current: number;
  /** How many pages there are; at least 1. */
  total: number;
  /** The previous page's link; null on the first page. */
  previous: string | null;
  /** The next page's link; null on the last page. */
  next: string | null;
  /** The page window: a page link, or null for a gap. */
  pages: Array<PaginationPage | null>;
}

/**
 * `Pagination`'s pages and links: `page` and `pages` floored and clamped, and
 * each link from `href`, or else `url` with `parameter` set in its query.
 */
export function paginationModel({
  page,
  pages,
  url,
  parameter,
  href,
}: {
  page: number;
  pages: number;
  url: string;
  parameter: string;
  href?: (page: number) => string;
}): PaginationModel {
  const total = Math.max(1, Math.floor(pages));
  const current = Math.min(Math.max(1, Math.floor(page)), total);
  const link = href ?? ((p: number) => pageHref(url, p, parameter));
  return {
    current,
    total,
    previous: current > 1 ? link(current - 1) : null,
    next: current < total ? link(current + 1) : null,
    pages: pageWindow(current, total).map((p) => (p === null ? null : { page: p, href: link(p), current: p === current })),
  };
}
