// The section nav's tree (B6), shared by every framework's SectionNav and the
// stories' sample data.

export interface SectionNavItem {
  label: string;
  href: string;
  /** This is the page being shown: `aria-current="page"`, and its ancestors start open. */
  current?: boolean;
  children?: SectionNavItem[];
}

/** Whether `item` or one of its descendants is the current page. */
export function holdsCurrent(item: SectionNavItem): boolean {
  return !!item.current || (item.children ?? []).some(holdsCurrent);
}
