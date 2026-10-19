// Story data for the DataTable stories: many ties on both columns, in an input
// order that is neither sorted nor reversed.
export interface Person {
  id: string;
  name: string;
  group: number;
}

export function people(count: number): Person[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `r${i}`,
    name: `Person ${String((i * 7) % 13).padStart(2, '0')}`,
    group: i % 3,
  }));
}

export const byName = (a: Person, b: Person) => a.name.localeCompare(b.name);
export const byGroup = (a: Person, b: Person) => a.group - b.group;

/** Row ids after a stable sort, as the legacy pages sorted. */
export const stableSorted = (rows: Person[], cmp: (a: Person, b: Person) => number, dir: 1 | -1) =>
  rows.toSorted((a, b) => dir * cmp(a, b)).map((r) => r.id);
