import { useState } from 'react';

import { Button } from '../../src/react/index.ts';

// The React twin of stories/ButtonDemo.svelte. Both forms, enabled and
// disabled, between two native controls, so a test can Tab through and see
// which ones are skipped.
export function ButtonDemo() {
  const [pressed, setPressed] = useState(0);
  const [disabledPressed, setDisabledPressed] = useState(0);

  return (
    <>
      <p>
        <button type="button">Before</button> <Button href="#button-demo-target">Link button</Button>{' '}
        <Button onClick={() => setPressed((n) => n + 1)}>Plain button</Button>{' '}
        <Button disabled onClick={() => setDisabledPressed((n) => n + 1)}>
          Disabled button
        </Button>{' '}
        <Button href="#button-demo-target" disabled onClick={() => setDisabledPressed((n) => n + 1)}>
          Disabled link
        </Button>{' '}
        <button type="button">After</button>
      </p>
      <p>
        Plain button pressed: <output data-testid="pressed">{pressed}</output>
      </p>
      <p>
        Disabled controls pressed: <output data-testid="disabled-pressed">{disabledPressed}</output>
      </p>
      {/* tabIndex -1: following the link moves focus here instead of to <body>. */}
      <p id="button-demo-target" tabIndex={-1}>
        The link&apos;s target.
      </p>
    </>
  );
}
