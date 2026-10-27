import type { CSSProperties } from 'react';

/**
 * A `style` of custom properties, leaving out the unset ones; none set is no
 * `style` at all, as Svelte's `style:--name={undefined}` renders nothing.
 */
export function cssVars(vars: Record<`--${string}`, string | undefined>): CSSProperties | undefined {
  const set = Object.entries(vars).filter(([, value]) => value !== undefined);
  return set.length ? (Object.fromEntries(set) as CSSProperties) : undefined;
}
