// The page shell (B1), rendering the markup documented in the README: a skip
// link, then the header, main and footer landmarks, and optionally the
// back-to-top link (B7), styled by page.css. The CSS form of <ilw-page>, plus
// the skip link the toolkit lacks. The shell has tabindex="-1" so following
// back-to-top moves focus to it, not to <body>. The React twin of Page.svelte.

import type { ReactNode } from 'react';

import { classNames } from '../core/class-names.ts';
import { BackToTop } from './BackToTop.tsx';

export interface PageProps {
  /** The skip link's text. */
  skipLinkText?: string;
  /** The id of `<main>`, which the skip link targets. */
  mainId?: string;
  /** The shell's own id, the back-to-top target. */
  id?: string;
  /** Adds `ilw-format` (the prose styles) to the shell. */
  format?: boolean;
  /** Adds `ilw-margin`: side margins on `main`. */
  margin?: boolean;
  /** Adds `ilw-page--expanded`: top and bottom margin on `main` (the toolkit's `expanded`). */
  expanded?: boolean;
  /** Adds the back-to-top link (B7) as the shell's last child, targeting its `id`. */
  backToTop?: boolean;
  /** More classes on the shell. */
  className?: string;
  /** The banner: a `<header>` (or the B2 header) is rendered as given. */
  header?: ReactNode;
  /** The content info: a `<footer>` (or `Footer`) is rendered as given. */
  footer?: ReactNode;
  /** The content of `<main>`. */
  children?: ReactNode;
}

export function Page({
  skipLinkText = 'Skip to main content',
  mainId = 'main-content',
  id = 'top',
  format = false,
  margin = false,
  expanded = false,
  backToTop = false,
  className = '',
  header,
  footer,
  children,
}: PageProps) {
  return (
    <div
      className={classNames('ilw-page', format && 'ilw-format', margin && 'ilw-margin', expanded && 'ilw-page--expanded', className)}
      id={id}
      tabIndex={-1}
    >
      <a className="ilw-skip-link" href={`#${mainId}`}>
        {skipLinkText}
      </a>
      {header}
      <main id={mainId} tabIndex={-1}>
        {children}
      </main>
      {footer}
      {backToTop && <BackToTop target={id} />}
    </div>
  );
}
