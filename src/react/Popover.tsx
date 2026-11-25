// A popover (E18), rendering the markup documented in the README: a button
// (`label`, or the `trigger` render prop, which spreads `attrs` on its button)
// that opens a non-modal panel (`children`) anchored to it. The panel is a
// native auto popover opened by the button's `popoverTarget`, so Escape, a
// click outside and focus return come from the browser, and the markup works
// without script. The component reports `onOpenChange`, drives the panel from
// `open` when given, closes it when focus leaves, and places it by script
// where CSS anchor positioning isn't supported. Styled by popover.css. The
// React twin of Popover.svelte.

import { type FocusEvent, type ReactNode, useEffect, useRef, useState } from 'react';

import { classNames } from '../core/class-names.ts';
import {
  anchorPositioning,
  closeOnFocusLeave,
  followPopover,
  type PopoverPlacement,
  syncPopover,
} from '../core/popover.ts';
import { useNextId } from './use-next-id.ts';

export type { PopoverPlacement };

/** What `Popover` hands a custom trigger: spread it on the button. */
export interface PopoverAttrs {
  popoverTarget: string;
}

export interface PopoverProps {
  /** The default button's text (an `.ilw-button`). */
  label?: string;
  /** Any other button instead of `label`'s. Spread `attrs` on it, and return only that element. */
  trigger?: (attrs: PopoverAttrs) => ReactNode;
  /** Where the panel sits against the button; it flips to the other side when there's no room. */
  placement?: PopoverPlacement;
  /**
   * Shows or hides the panel when it changes. Optional: the browser keeps the panel's state (the
   * button, Escape, a click outside), so without it the popover is uncontrolled.
   */
  open?: boolean;
  /** Called whenever the panel opens or closes, by any means. */
  onOpenChange?: (open: boolean) => void;
  /** The panel's id; the button's `popovertarget`. */
  id?: string;
  /** More classes on the wrapper. */
  className?: string;
  /** The panel's content. */
  children: ReactNode;
}

export function Popover({
  label,
  trigger,
  placement = 'bottom-left',
  open,
  onOpenChange,
  id: givenId,
  className = '',
  children,
}: PopoverProps) {
  const id = useNextId('ilw-popover', givenId);
  const host = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const onOpenChangeRef = useRef(onOpenChange);

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });

  // The panel's toggle event, by addEventListener: it fires for a popover, not only for <details>.
  useEffect(() => {
    const el = panel.current!;
    const ontoggle = (event: Event) => {
      const now = (event as ToggleEvent).newState === 'open';
      setShown(now);
      onOpenChangeRef.current?.(now);
    };
    el.addEventListener('toggle', ontoggle);
    return () => el.removeEventListener('toggle', ontoggle);
  }, []);

  useEffect(() => {
    if (open !== undefined) syncPopover(panel.current!, open);
  }, [open]);

  useEffect(() => {
    if (!shown || anchorPositioning()) return;
    return followPopover(host.current!.firstElementChild!, panel.current!, placement);
  }, [shown, placement]);

  const attrs: PopoverAttrs = { popoverTarget: id };

  return (
    <span
      ref={host}
      className={classNames('ilw-popover', `ilw-popover--${placement}`, className)}
      onBlur={(event: FocusEvent) => closeOnFocusLeave(host.current!, panel.current!, event.nativeEvent)}
    >
      {trigger ? (
        trigger(attrs)
      ) : (
        <button type="button" className="ilw-button" {...attrs}>
          {label}
        </button>
      )}
      <div ref={panel} className="ilw-popover-panel" id={id} popover="">
        {children}
      </div>
    </span>
  );
}
