// The page title (B5), rendering the markup documented in the README: the
// page's <h1> on a colour plate, over an optional decorative background image.
// Styled by page-title.css. The React twin of PageTitle.svelte.

import type { ReactNode } from 'react';

import { classNames } from '../core/class-names.ts';
import type { LayoutWidth } from '../core/layout.ts';

export interface PageTitleProps {
  /** The toolkit's `theme`: unset is white text on the heading colour. */
  theme?: 'blue' | 'orange' | 'white';
  /** Fades the image out downwards and makes the plate solid. */
  fade?: boolean;
  /** The background image's URL. It is decorative (`alt=""`): the heading carries the content. */
  image?: string;
  /** `full` spans the page; `auto` and `page` span it with the text at the side margin (the toolkit treats them alike). */
  width?: LayoutWidth;
  /** More classes on the outer element. */
  className?: string;
  /** The heading text, rendered inside the `<h1>`. */
  children: ReactNode;
}

export function PageTitle({ theme, fade = false, image, width, className = '', children }: PageTitleProps) {
  return (
    <div
      className={classNames(
        'ilw-page-title',
        theme && `ilw-page-title--${theme}`,
        fade && 'ilw-page-title--fade',
        width && (width === 'full' ? 'ilw-width-full' : 'ilw-width-auto'),
        className,
      )}
    >
      {image && <img className="ilw-page-title-background" src={image} alt="" />}
      <div className="ilw-page-title-inner">
        <div className="ilw-page-title-text">
          <h1>{children}</h1>
        </div>
      </div>
    </div>
  );
}
