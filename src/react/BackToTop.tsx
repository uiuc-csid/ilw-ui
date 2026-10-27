// Back to top (B7), rendering the markup documented in the README: a link to
// the page shell's id. Put it last in the shell (`Page`'s `backToTop` prop does).
// No script: following the link scrolls up and moves the sequential-focus
// starting point, so the next Tab is the skip link. Styled by back-to-top.css,
// which fades it in as the page scrolls. The React twin of BackToTop.svelte.

export interface BackToTopProps {
  /** The id of the element at the top of the page: the shell (`Page`'s `id`). */
  target?: string;
  /** The link's accessible name. */
  label?: string;
}

export function BackToTop({ target = 'top', label = 'Back to top' }: BackToTopProps) {
  return (
    <a className="ilw-back-to-top" href={`#${target}`}>
      <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <path d="M8 24l2.83 2.83L22 15.66V40h4V15.66l11.17 11.17L40 24 24 8 8 24z" />
      </svg>
      <span className="ilw-visually-hidden">{label}</span>
    </a>
  );
}
