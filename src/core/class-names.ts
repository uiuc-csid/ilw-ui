/**
 * Joins class names in order, leaving out empty and falsy ones:
 * `classNames('ilw-button', theme && `ilw-theme-${theme}`)`. No dedupe and no
 * reordering, so the result is the exact string tests assert.
 */
export function classNames(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
