// A stand-in for a server search endpoint, for the async stories. Requests
// wait until the test (or the story's "Test server" panel) answers them, so
// tests control the loading state without the network or the clock.

import { type ComboboxItem, filterItems } from '../src/core/index.ts';

export interface StubRequest {
  readonly query: string;
  readonly signal: AbortSignal;
  /** Resolves with the matching items. */
  respond: () => void;
  /** Rejects, as a failed fetch would. */
  fail: () => void;
}

export class StubServer<T extends ComboboxItem> {
  /** Every request since the last reset, oldest first. */
  requests = $state.raw<StubRequest[]>([]);
  /** Requests neither answered nor aborted, oldest first (kept in step for the panel). */
  pending = $state.raw<StubRequest[]>([]);
  /** Answer each request at once (in a microtask) instead of waiting. */
  auto: boolean;
  readonly data: T[];

  constructor(data: T[], { auto = false } = {}) {
    this.data = data;
    this.auto = auto;
  }

  /** The `source` prop: matches like `filterItems`, over every item. */
  source = (query: string, signal: AbortSignal): Promise<T[]> =>
    new Promise((resolve, reject) => {
      const matches = () => filterItems(this.data, query, Infinity).shown;
      if (this.auto) {
        resolve(matches());
        return;
      }
      const settle = () => {
        this.pending = this.pending.filter((r) => r !== request);
      };
      const request: StubRequest = {
        query,
        signal,
        respond: () => {
          settle();
          resolve(matches());
        },
        fail: () => {
          settle();
          reject(new Error('Search failed'));
        },
      };
      signal.addEventListener('abort', settle, { once: true });
      this.requests = [...this.requests, request];
      this.pending = [...this.pending, request];
    });

  /** The newest request. */
  get last(): StubRequest | undefined {
    return this.requests.at(-1);
  }

  reset(): void {
    this.requests = [];
    this.pending = [];
  }
}
