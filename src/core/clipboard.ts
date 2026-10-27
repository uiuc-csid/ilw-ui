import { announce } from './announce.ts';

export interface CopyTextOptions {
  /** Announced (politely) after the write. Default "Copied". */
  copied?: string;
  /** Announced (assertively) when the browser refuses. Default "Could not copy to the clipboard". */
  failed?: string;
}

/**
 * Writes `text` to the clipboard and says so through `announce()`. A function
 * is called first, so the text can be built at the moment of copying. Resolves
 * `false`, after announcing `failed`, when that throws or the browser refuses:
 * no permission, or no `navigator.clipboard` at all outside a secure context
 * (plain http).
 */
export async function copyText(
  text: string | (() => string),
  { copied = 'Copied', failed = 'Could not copy to the clipboard' }: CopyTextOptions = {},
): Promise<boolean> {
  try {
    // Undefined outside a secure context; the TypeError lands in the catch.
    await navigator.clipboard.writeText(typeof text === 'function' ? text() : text);
  } catch {
    announce(failed, { politeness: 'assertive' });
    return false;
  }
  announce(copied);
  return true;
}
