import { Button, type ButtonTheme } from '../../../src/react/index.ts';
import { BUTTON_THEMES } from '../../parity/button-themes.ts';

import '../../parity/ButtonGrid.css';

const themeOf = (t: string) => (t === 'none' ? undefined : (t as ButtonTheme));

// The React twin of stories/parity/ButtonGrid.svelte. One row per theme: every
// size, then both disabled forms. Rendered with the Button component on both
// sides of the pair: its markup is the toolkit's.
export function ButtonGrid({
  variant = 'all',
}: {
  /** 'all', 'lists', or one theme id from BUTTON_THEMES ('none' is no theme class). */
  variant?: string;
}) {
  const themes = variant === 'all' ? BUTTON_THEMES : BUTTON_THEMES.filter((t) => t === variant);
  return (
    <div className="button-grid">
      {themes.map((t) => (
        <div key={t} className="button-grid-row" data-theme-id={t}>
          <Button theme={themeOf(t)} size="small" href={`#${t}-small`}>
            Small
          </Button>
          <Button theme={themeOf(t)}>Medium</Button>
          <Button theme={themeOf(t)} size="large" href={`#${t}-large`}>
            Large
          </Button>
          <Button theme={themeOf(t)} disabled>
            Disabled
          </Button>
          <Button theme={themeOf(t)} href={`#${t}-off`} disabled>
            Disabled link
          </Button>
        </div>
      ))}
      {(variant === 'all' || variant === 'lists') && (
        <>
          <ul className="ilw-buttons">
            <li>
              <a href="#list-1">Centred list</a>
            </li>
            <li>
              <button type="button">Of buttons</button>
            </li>
          </ul>
          <ul className="ilw-buttons ilw-button-small">
            <li>
              <a href="#list-2">Small list</a>
            </li>
            <li>
              <a href="#list-3">Of links</a>
            </li>
          </ul>
          <ul className="ilw-buttons-left">
            <li>
              <a className="ilw-button" href="#list-4">
                Left list
              </a>
            </li>
            <li>
              <a className="ilw-button ilw-theme-blue-solid" href="#list-5">
                Items carry .ilw-button
              </a>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
