// The React twin of stories/SortableTable.svelte: three SortableTh headings
// sorting a small table with nextSort.

import { useState } from 'react';

import { nextSort, type Sort } from '../../src/core/index.ts';
import { SortableTh } from '../../src/react/SortableTh.tsx';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'course', label: 'Course' },
  { key: 'hours', label: 'Hours' },
] as const;
const rows = [
  { name: 'Avery', course: 'CS 225', hours: 20 },
  { name: 'Blake', course: 'CS 124', hours: 10 },
  { name: 'Casey', course: 'CS 173', hours: 15 },
];

export function SortableTable() {
  const [sort, setSort] = useState<Sort>({ key: 'name', dir: 1 });
  const sorted = rows.toSorted((a, b) => {
    const x = a[sort.key as keyof typeof a];
    const y = b[sort.key as keyof typeof b];
    return (x < y ? -1 : x > y ? 1 : 0) * sort.dir;
  });
  return (
    <table className="ilw-table">
      <caption>TA hours</caption>
      <thead>
        <tr>
          {columns.map((col) => (
            <SortableTh key={col.key} sortKey={col.key} label={col.label} sort={sort} onSort={(key) => setSort(nextSort(sort, key))} />
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((row) => (
          <tr key={row.name}>
            <td>{row.name}</td>
            <td>{row.course}</td>
            <td>{row.hours}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
