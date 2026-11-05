// The React twin of stories/CopyButtonDemo.svelte. Stands in for the
// ta-manager pages that copy: a course page's share link (an input's value, by
// id), a new API token (an element's text, by id), and a roster with a per-row
// netid button (icon only, a literal value) and a "Copy netids" button whose
// text is built from the rows at click time.

import { useState } from 'react';

import { CopyButton } from '../../src/react/index.ts';

import '../CopyButtonDemo.css';

const ROSTER = [
  { netid: 'aturing2', name: 'Alan Turing', confirmed: true },
  { netid: 'ghopper3', name: 'Grace Hopper', confirmed: true },
  { netid: 'kjohnson', name: 'Katherine Johnson', confirmed: false },
];

export function CopyButtonDemo({ resetAfter = 1500 }: { resetAfter?: number }) {
  const [roster, setRoster] = useState(ROSTER);
  const confirmed = roster.filter((r) => r.confirmed);
  const confirm = (netid: string, on: boolean) => setRoster((rows) => rows.map((r) => (r.netid === netid ? { ...r, confirmed: on } : r)));

  return (
    <>
      <h2>Share this course</h2>
      <p>Anyone with the link can see the posting while applications are open.</p>
      <p className="ilw-copy-demo-row">
        <label htmlFor="share-link">Course link</label>{' '}
        <input id="share-link" className="ilw-copy-demo-input" readOnly value="https://tam.cs.illinois.edu/courses/cs-225/fa26" />{' '}
        <CopyButton target="share-link" label="Copy link" resetAfter={resetAfter} />
      </p>

      <h2>New API token</h2>
      <p>Copy the token now: it is shown only once.</p>
      <p className="ilw-copy-demo-row">
        <code id="new-token">tam_7Qx2dH9kLm4Rv8Zp</code>{' '}
        <CopyButton target="new-token" label="Copy token" theme="blue-solid" size="small" resetAfter={resetAfter} />
      </p>

      <h2>CS 225 teaching assistants</h2>
      <table>
        <caption>Applicants for Fall 2026</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">NetID</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {roster.map((row) => (
            <tr key={row.netid}>
              <td>{row.name}</td>
              <td>
                {row.netid}{' '}
                <CopyButton value={row.netid} label={`Copy netid of ${row.name}`} hideLabel size="small" resetAfter={resetAfter} />
              </td>
              <td>
                <label>
                  <input type="checkbox" checked={row.confirmed} onChange={(e) => confirm(row.netid, e.currentTarget.checked)} /> Confirmed
                  <span className="ilw-visually-hidden">: {row.name}</span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <CopyButton
          value={() => confirmed.map((r) => r.netid).join(', ')}
          label="Copy netids of confirmed students"
          resetAfter={resetAfter}
        />
      </p>
    </>
  );
}
