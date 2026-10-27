import { Button } from '../../src/react/index.ts';

import '../ButtonSurfaces.css';

// The React twin of stories/ButtonSurfaces.svelte. Every theme surface with a
// flat colour; the gradients' stops are checked in the README's contrast table
// instead.
const SURFACES = ['white', 'gray', 'blue', 'orange'];

export function ButtonSurfaces() {
  return (
    <div className="button-surfaces">
      {SURFACES.map((surface) => (
        // `theme` isn't a typed HTML attribute; the theme rules select on it.
        <section key={surface} className="button-surface" {...{ theme: surface }} aria-label={`${surface} surface`}>
          <Button>On {surface}</Button>
        </section>
      ))}
    </div>
  );
}
