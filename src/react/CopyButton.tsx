// A copy button (E6): copies a value, or the text of an element by id, and says
// so through announce() (A9). The icon and label swap to "Copied" (or "Copy
// failed") for a moment; focus stays on the button. No toolkit equivalent.
// Styled by copy-button.css on top of button.css. The React twin of
// CopyButton.svelte.

import { CheckIcon } from '@phosphor-icons/react/dist/ssr/Check';
import { CopyIcon } from '@phosphor-icons/react/dist/ssr/Copy';
import { WarningIcon } from '@phosphor-icons/react/dist/ssr/Warning';
import { type ComponentProps, useEffect, useRef, useState } from 'react';

import { classNames } from '../core/class-names.ts';
import { copyText } from '../core/clipboard.ts';
import { Button, type ButtonSize, type ButtonTheme } from './Button.tsx';
import { Icon } from './Icon.tsx';

export type CopyButtonProps = {
  /** What to copy: a string, or a function called on each click. */
  value?: string | (() => string);
  /** Instead of `value`: the id of the element whose text (an input's or textarea's value) is copied. */
  target?: string;
  /** The button's text. */
  label?: string;
  /** The text shown, and announced, after a copy. */
  copiedLabel?: string;
  /** The text shown after a refused copy. */
  failedLabel?: string;
  /** Announced (assertively) after a refused copy. */
  failedMessage?: string;
  /** Icon only: the label stays as screen-reader text, so it is still the button's name. */
  hideLabel?: boolean;
  /** How long, in ms, the copied or failed state lasts. */
  resetAfter?: number;
  /** Called with the text after a successful copy (Svelte's `oncopy`: `onCopy` is the DOM's copy event). */
  onCopied?: (text: string) => void;
  /** Called after a refused copy. */
  onFail?: () => void;
  size?: ButtonSize;
  theme?: ButtonTheme;
  disabled?: boolean;
  className?: string;
} & Omit<ComponentProps<'button'>, 'value' | 'children' | 'className' | 'disabled' | 'onClick'>;

export function CopyButton({
  value,
  target,
  label = 'Copy',
  copiedLabel = 'Copied',
  failedLabel = 'Copy failed',
  failedMessage = 'Could not copy to the clipboard',
  hideLabel = false,
  resetAfter = 1500,
  onCopied,
  onFail,
  className,
  ...rest
}: CopyButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  /** The text to copy, read at click time. Throws when there is nothing to read, so the copy fails visibly. */
  function source(): string {
    if (target === undefined) {
      if (value === undefined) throw new Error('CopyButton needs `value` or `target`');
      return typeof value === 'function' ? value() : value;
    }
    const el = document.getElementById(target);
    if (!el) throw new Error(`CopyButton: no element #${target}`);
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return el.value;
    return (el.textContent ?? '').trim();
  }

  async function copy() {
    let written = '';
    const ok = await copyText(() => (written = source()), { copied: copiedLabel, failed: failedMessage });
    setStatus(ok ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), resetAfter);
    if (ok) onCopied?.(written);
    else onFail?.();
  }

  const icon = status === 'copied' ? CheckIcon : status === 'failed' ? WarningIcon : CopyIcon;
  const text = status === 'copied' ? copiedLabel : status === 'failed' ? failedLabel : label;

  return (
    <Button {...rest} className={classNames('ilw-copy-button', className)} data-state={status} onClick={copy}>
      <Icon icon={icon} type="line" />
      <span className={hideLabel ? 'ilw-visually-hidden' : 'ilw-copy-button-label'}>{text}</span>
    </Button>
  );
}
