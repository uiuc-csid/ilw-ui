// Stands in for a course's staff page in ta-manager: a "Filters" popover of
// role checkboxes with a Done button above the staff list, and a "?" help
// popover beside a form field, whose panel explains the term and links to the
// policy. `open` opens the filters panel; the <output> shows its state.
// `label` and `placement` are the filters popover's (the stories' controls). The
// React twin of stories/PopoverDemo.svelte.

import { useState } from 'react';

import type { PopoverPlacement } from '../../src/core/popover.ts';
import { Popover } from '../../src/react/Popover.tsx';

import '../PopoverDemo.css';

export interface PopoverDemoProps {
  open?: boolean;
  label?: string;
  placement?: PopoverPlacement;
}

export function PopoverDemo({ open = false, label = 'Filters', placement = 'bottom-left' }: PopoverDemoProps) {
  const [filters, setFilters] = useState(open);
  return (
    <>
      <h1>CS 225: Course staff</h1>
      <p>Teaching assistants, graders and course assistants for this term. Filter the list by role.</p>

      <div className="popover-demo-toolbar">
        <Popover id="staff-filters" label={label} placement={placement} open={filters} onOpenChange={setFilters}>
          <fieldset className="ilw-fieldset">
            <legend>Show</legend>
            <div className="ilw-input-entry-checkbox">
              <label htmlFor="show-tas">Teaching assistants</label>
              <input id="show-tas" type="checkbox" defaultChecked />
            </div>
            <div className="ilw-input-entry-checkbox">
              <label htmlFor="show-graders">Graders</label>
              <input id="show-graders" type="checkbox" defaultChecked />
            </div>
            <div className="ilw-input-entry-checkbox">
              <label htmlFor="show-cas">Course assistants</label>
              <input id="show-cas" type="checkbox" />
            </div>
          </fieldset>
          <button type="button" className="ilw-button" popoverTarget="staff-filters" popoverTargetAction="hide">
            Done
          </button>
        </Popover>
        <p>
          Filters panel: <output data-testid="filters-state">{filters ? 'open' : 'closed'}</output>
        </p>
      </div>

      <ul>
        <li>Ana Ruiz, teaching assistant</li>
        <li>Ben Okafor, teaching assistant</li>
        <li>Chen Wei, grader</li>
        <li>Dana Fox, grader</li>
      </ul>

      <div className="popover-demo-field">
        <div className="ilw-input-entry">
          <label htmlFor="office-hours">Office hours per week</label>
          <input id="office-hours" type="number" min="0" defaultValue="4" />
        </div>
        <Popover
          id="help-hours"
          trigger={(attrs) => (
            <button type="button" className="ilw-button popover-demo-help" aria-label="About office hours" {...attrs}>
              ?
            </button>
          )}
        >
          <p>
            Count only hours held at a fixed place and time. Review sessions count; answering email doesn&apos;t. See{' '}
            <a href="#staffing-policy">the staffing policy</a>.
          </p>
        </Popover>
      </div>
    </>
  );
}
