// Shared by the A5 layout components and the page chrome that takes a width.

/** The toolkit's `width`: `full` spans the page, `auto` spans it but keeps the content at the side margin, `page` sits at the side margin. */
export type LayoutWidth = 'full' | 'auto' | 'page';

/** The toolkit's `theme` on content, columns and grid: an A1 `theme` attribute. */
export type LayoutTheme = 'white' | 'gray' | 'blue' | 'orange' | 'blue-gradient' | 'orange-gradient';

/** The width.css class for a width, or nothing. */
export function widthClass(width: LayoutWidth | undefined): string | undefined {
  return width && `ilw-width-${width}`;
}
