<!--
  A copy button (E6): copies a value, or the text of an element by id, and says
  so through announce() (A9). The icon and label swap to "Copied" (or "Copy
  failed") for a moment; focus stays on the button. No toolkit equivalent.
  Styled by copy-button.css on top of button.css.
-->
<script lang="ts">
  import Check from 'phosphor-svelte/lib/Check';
  import Copy from 'phosphor-svelte/lib/Copy';
  import Warning from 'phosphor-svelte/lib/Warning';
  import type { ClassValue, HTMLButtonAttributes } from 'svelte/elements';

  import { copyText } from '../core/clipboard.ts';
  import Button, { type ButtonSize, type ButtonTheme } from './Button.svelte';
  import Icon from './Icon.svelte';

  type Props = {
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
    /** Called with the text after a successful copy. */
    oncopy?: (text: string) => void;
    /** Called after a refused copy. */
    onfail?: () => void;
    size?: ButtonSize;
    theme?: ButtonTheme;
    disabled?: boolean;
    class?: ClassValue;
  } & Omit<HTMLButtonAttributes, 'value' | 'children' | 'class' | 'disabled' | 'onclick'>;

  let {
    value,
    target,
    label = 'Copy',
    copiedLabel = 'Copied',
    failedLabel = 'Copy failed',
    failedMessage = 'Could not copy to the clipboard',
    hideLabel = false,
    resetAfter = 1500,
    oncopy,
    onfail,
    class: cls,
    ...rest
  }: Props = $props();

  let status = $state<'idle' | 'copied' | 'failed'>('idle');
  let timer: ReturnType<typeof setTimeout> | undefined;

  $effect(() => () => clearTimeout(timer));

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
    status = ok ? 'copied' : 'failed';
    clearTimeout(timer);
    timer = setTimeout(() => (status = 'idle'), resetAfter);
    if (ok) oncopy?.(written);
    else onfail?.();
  }

  const icon = $derived(status === 'copied' ? Check : status === 'failed' ? Warning : Copy);
  const text = $derived(status === 'copied' ? copiedLabel : status === 'failed' ? failedLabel : label);
</script>

<Button {...rest} class={['ilw-copy-button', cls]} data-state={status} onclick={copy}>
  <Icon {icon} type="line" />
  <span class={hideLabel ? 'ilw-visually-hidden' : 'ilw-copy-button-label'}>{text}</span>
</Button>
