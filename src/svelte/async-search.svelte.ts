// The core AsyncSearch (src/core/async-search.ts), mirrored into `$state` so
// Combobox, MultiCombobox and Autocomplete re-render as it changes.

import { type AsyncSource, type AsyncStatus, AsyncSearch as Search } from '../core/async-search.ts';

export { type AsyncSource, statusText } from '../core/async-search.ts';

export class AsyncSearch<T> {
  status = $state<AsyncStatus>('idle');
  /** The last results that arrived, for `query`. */
  results = $state.raw<T[]>([]);
  /** The query `results` (or the error) belong to. */
  query = $state('');

  #search: Search<T>;

  /** Getters, so the component's current props are read on each search. */
  constructor(
    source: () => AsyncSource<T>,
    delay: () => number,
    onresults: (query: string, results: T[]) => void = () => {},
  ) {
    this.#search = new Search(source, delay, onresults);
    this.#search.subscribe(({ status, results, query }) => {
      this.status = status;
      this.results = results;
      this.query = query;
    });
  }

  /** Searches for `query` after the debounce delay, or at once with `immediate`. */
  search(query: string, immediate = false): void {
    this.#search.search(query, immediate);
  }

  /** Aborts the pending or in-flight search and goes idle. */
  cancel(): void {
    this.#search.cancel();
  }
}
