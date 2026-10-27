// Moved to src/core/layout.ts. Only stories/TooltipDemo.svelte still imports
// this path; it is kept until that story points at core (R0d), so this change
// stays out of the story files the R0b plumbing PR is editing.
export type { LayoutTheme, LayoutWidth } from '../core/layout.ts';
