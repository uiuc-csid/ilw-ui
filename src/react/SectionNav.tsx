// The section nav (B6), rendering the markup documented in the README: a
// labelled nav holding nested lists of links, where each branch is a link plus
// a separate <details> toggle for its subpages. No script: the server-rendered
// `open` attributes put the current page's branch open, and the browser does
// the rest. Styled by section-nav.css. The React twin of SectionNav.svelte.

import { useId } from 'react';

import { classNames } from '../core/class-names.ts';
import { holdsCurrent, type SectionNavItem } from '../core/section-nav.ts';

export type { SectionNavItem };

export interface SectionNavProps {
  /** The section's pages, as a tree. */
  items: SectionNavItem[];
  /** The nav's name, and the text of the toggle at narrow widths. */
  label?: string;
  /** Styles the first item as the section's own page (`ilw-section-nav--root`), as upstream. */
  root?: boolean;
  /** Starts the narrow-width "Pages In This Section" toggle open. Wider than 700 px the list always shows. */
  open?: boolean;
  /** Starts every branch open (upstream's look, which has no branch toggles), not only the current one's. */
  expanded?: boolean;
  /** Prefix for the label's id; defaults to a generated one. */
  id?: string;
  /** More classes on the nav. */
  className?: string;
}

function Chevron() {
  return (
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.4 23.82">
      <path
        fill="currentColor"
        d="m39.34,1.06c-1.41-1.41-3.7-1.41-5.12,0l-14.02,14.02L6.18,1.06C4.76-.35,2.47-.35,1.06,1.06s-1.41,3.7,0,5.12l16.58,16.58c1.41,1.41,3.7,1.41,5.12,0L39.34,6.18c1.41-1.41,1.41-3.7,0-5.12Z"
      />
    </svg>
  );
}

function List({ level, top, root, expanded }: { level: SectionNavItem[]; top: boolean; root: boolean; expanded: boolean }) {
  return (
    <ul>
      {level.map((item, i) => {
        const link = (
          <a
            href={item.href}
            className={top && root && i === 0 ? 'ilw-section-nav--root' : undefined}
            aria-current={item.current ? 'page' : undefined}
          >
            {item.label}
          </a>
        );
        return item.children?.length ? (
          <li key={i} className="ilw-section-nav-branch">
            {link}
            <details open={expanded || holdsCurrent(item)}>
              <summary>
                <span className="ilw-visually-hidden">Subpages of {item.label}</span>
                <Chevron />
              </summary>
              <List level={item.children} top={false} root={root} expanded={expanded} />
            </details>
          </li>
        ) : (
          <li key={i}>{link}</li>
        );
      })}
    </ul>
  );
}

export function SectionNav({
  items,
  label = 'Pages In This Section',
  root = true,
  open = false,
  expanded = false,
  id,
  className = '',
}: SectionNavProps) {
  const uid = useId();
  const labelId = `${id ?? uid}-label`;
  return (
    <nav className={classNames('ilw-section-nav', className)} aria-labelledby={labelId}>
      <details className="ilw-section-nav-collapse" open={open}>
        <summary id={labelId}>
          {label}
          <Chevron />
        </summary>
        <List level={items} top root={root} expanded={expanded} />
      </details>
    </nav>
  );
}
