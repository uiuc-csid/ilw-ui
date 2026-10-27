// Spacer (A5), rendering the markup documented in the README: an empty,
// hidden block of vertical space. Styled by spacer.css. The React twin of
// Spacer.svelte.

import { cssVars } from './css-vars.ts';

export interface SpacerProps {
  /** Any CSS length (the toolkit's `height`); unset is spacer.css's 20px. */
  height?: string;
}

export function Spacer({ height }: SpacerProps) {
  return <div className="ilw-spacer" aria-hidden="true" style={cssVars({ '--ilw-spacer--height': height })}></div>;
}
