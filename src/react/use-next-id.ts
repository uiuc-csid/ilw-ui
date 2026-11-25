// The React form of core's nextId: a page-unique `${prefix}-N`, taken once per
// component instance (a useState initializer). StrictMode runs initializers
// twice in development, so numbers can skip; the format holds.

import { useState } from 'react';

import { nextId } from '../core/index.ts';

export function useNextId(prefix: string, given?: string): string {
  const [id] = useState(() => given ?? nextId(prefix));
  return given ?? id;
}
