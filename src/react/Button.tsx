// A button or a link styled as one, rendering the markup documented in the
// README: `<a class="ilw-button">` with an href, or `<button type="button"
// class="ilw-button">`. Styled by button.css. The React twin of Button.svelte.

import type { ComponentProps, ReactNode } from 'react';

import { classNames } from '../core/class-names.ts';

/** The toolkit's button themes; none is the blue outline button. */
export type ButtonTheme =
  | 'blue'
  | 'blue-outline'
  | 'blue-1'
  | 'blue-solid'
  | 'orange'
  | 'orange-outline'
  | 'orange-1'
  | 'orange-solid';
export type ButtonSize = 'small' | 'medium' | 'large';

interface Common {
  size?: ButtonSize;
  theme?: ButtonTheme;
  /** A button gets `disabled`; a link loses its href and gets `aria-disabled="true"`. */
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}
export type ButtonLinkProps = Common & { href: string } & Omit<ComponentProps<'a'>, keyof Common | 'href'>;
export type ButtonButtonProps = Common & { href?: undefined } & Omit<ComponentProps<'button'>, keyof Common>;
export type ButtonProps = ButtonLinkProps | ButtonButtonProps;

export function Button({ size = 'medium', theme, disabled = false, className, children, ...rest }: ButtonProps) {
  const classes = classNames('ilw-button', size !== 'medium' && `ilw-button-${size}`, theme && `ilw-theme-${theme}`, className);

  if (rest.href === undefined) {
    const { href: _href, ...button } = rest;
    return (
      <button type="button" {...button} className={classes} disabled={disabled}>
        {children}
      </button>
    );
  }
  if (disabled) {
    // No href, so it leaves the Tab order; role keeps it announced as a link.
    const { href: _href, tabIndex: _tabIndex, onClick: _onClick, ...link } = rest;
    return (
      <a {...link} className={classes} role="link" aria-disabled="true">
        {children}
      </a>
    );
  }
  return (
    <a {...rest} className={classes}>
      {children}
    </a>
  );
}
