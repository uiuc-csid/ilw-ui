/// <reference types="vite/client" />

import type { DetailedHTMLProps, HTMLAttributes } from 'react';

// The toolkit's page shell, which the shell decorator renders for stories that load toolkit.css.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'ilw-page': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & { class?: string };
    }
  }
}
