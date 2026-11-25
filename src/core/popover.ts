// Popover (E18): what Popover.svelte and Popover.tsx share. The panel is a
// native auto popover opened by its button's popovertarget; this is the script
// the components add on top: placing it where CSS anchor positioning isn't
// supported (popover.css places it where it is), and closing it when focus
// leaves the wrapper.

/** Where the panel sits: `bottom-left` is under the button, left edges aligned. */
export type PopoverPlacement = 'bottom-left' | 'bottom-center' | 'bottom-right' | 'top-left' | 'top-center' | 'top-right';

// popover.css's --ilw-popover--offset, and the panel's least distance from the viewport's sides.
const OFFSET = 4;
const MARGIN = 8;

/** Whether popover.css places the panel itself: the same check as its `@supports`. Call it at mount, never at module top level. */
export function anchorPositioning(): boolean {
  return typeof CSS !== 'undefined' && CSS.supports('position-area: top') && CSS.supports('anchor-scope: all');
}

/**
 * The script fallback: places `panel` against `button` as popover.css's position-area does, in
 * viewport pixels, flipping to the other side when there's no room (position-try-fallbacks:
 * flip-block) and staying 8px inside the viewport's sides.
 */
export function placePopover(button: Element, panel: HTMLElement, placement: PopoverPlacement): void {
  const style = panel.style;
  style.position = 'fixed';
  style.inset = 'auto';
  style.margin = '0';
  // Where anchor positioning exists but the script places it anyway (the keyboard spec stubs
  // CSS.supports), top and left would be offsets within the position-area: switch that off.
  style.setProperty('position-area', 'none');
  style.setProperty('position-try-fallbacks', 'none');
  // Measured at the viewport's corner: where it was last, less room could wrap it differently.
  style.top = style.left = '0px';
  const a = button.getBoundingClientRect();
  const b = panel.getBoundingClientRect();
  const { clientWidth, clientHeight } = document.documentElement;
  const [side, align] = placement.split('-');
  const below = a.bottom + OFFSET;
  const above = a.top - OFFSET - b.height;
  const fitsBelow = below + b.height <= clientHeight;
  const top = side === 'bottom' ? (fitsBelow || above < 0 ? below : above) : above >= 0 || !fitsBelow ? above : below;
  const left = align === 'left' ? a.left : align === 'right' ? a.right - b.width : a.left + (a.width - b.width) / 2;
  style.top = `${top}px`;
  style.left = `${Math.max(MARGIN, Math.min(left, clientWidth - MARGIN - b.width))}px`;
}

/** Keeps `panel` placed while it is open: on scroll, resize, and either box changing size. Returns the cleanup. */
export function followPopover(button: Element, panel: HTMLElement, placement: PopoverPlacement): () => void {
  const place = () => placePopover(button, panel, placement);
  place();
  window.addEventListener('scroll', place, { capture: true, passive: true });
  window.addEventListener('resize', place, { passive: true });
  const resized = new ResizeObserver(place);
  resized.observe(panel);
  resized.observe(button);
  return () => {
    resized.disconnect();
    window.removeEventListener('scroll', place, { capture: true });
    window.removeEventListener('resize', place);
  };
}

/**
 * The wrapper's `focusout`: closes the panel once focus moves to an element outside the wrapper
 * (Tab past the panel's end, Shift+Tab from the button), so it never covers what focus moved to.
 * Focus going nowhere (the window losing focus) leaves it open.
 */
export function closeOnFocusLeave(host: Element, panel: HTMLElement, event: FocusEvent): void {
  const to = event.relatedTarget as Node | null;
  if (!to || host.contains(to)) return;
  if (panel.matches(':popover-open')) panel.hidePopover();
}

/** Shows or hides `panel` to match `open`, if it doesn't already. */
export function syncPopover(panel: HTMLElement, open: boolean): void {
  if (open === panel.matches(':popover-open')) return;
  if (open) panel.showPopover();
  else panel.hidePopover();
}
