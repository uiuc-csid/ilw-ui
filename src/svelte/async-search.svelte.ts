// The async source shared by Combobox, MultiCombobox and Autocomplete: a
// debounced search where each new query aborts the one before it.

/** Fetches the items for `query`. Abort the request when `signal` fires. */
export type AsyncSource<T> = (query: string, signal: AbortSignal) => Promise<T[]>;

export type AsyncStatus = 'idle' | 'loading' | 'done' | 'error';

export class AsyncSearch<T> {
  status = $state<AsyncStatus>('idle');
  /** The last results that arrived, for `query`. */
  results = $state.raw<T[]>([]);
  /** The query `results` (or the error) belong to. */
  query = $state('');

  #controller: AbortController | null = null;
  #timer: ReturnType<typeof setTimeout> | undefined;

  #source: () => AsyncSource<T>;
  #delay: () => number;
  #onresults: (query: string, results: T[]) => void;

  /** Getters, so the component's current props are read on each search. */
  constructor(
    source: () => AsyncSource<T>,
    delay: () => number,
    onresults: (query: string, results: T[]) => void = () => {},
  ) {
    this.#source = source;
    this.#delay = delay;
    this.#onresults = onresults;
  }

  /** Searches for `query` after the debounce delay, or at once with `immediate`. */
  search(query: string, immediate = false): void {
    this.cancel();
    const controller = new AbortController();
    this.#controller = controller;
    this.status = 'loading';
    const run = () => {
      this.#timer = undefined;
      let request: Promise<T[]>;
      try {
        request = this.#source()(query, controller.signal);
      } catch (error) {
        request = Promise.reject(error);
      }
      request.then(
        (results) => {
          // A response for a search that was replaced is stale, even if the
          // source ignored the signal.
          if (controller.signal.aborted) return;
          this.#controller = null;
          this.query = query;
          this.results = results;
          this.status = 'done';
          this.#onresults(query, results);
        },
        () => {
          if (controller.signal.aborted) return;
          this.#controller = null;
          this.query = query;
          this.results = [];
          this.status = 'error';
        },
      );
    };
    const delay = this.#delay();
    if (immediate || delay <= 0) run();
    else this.#timer = setTimeout(run, delay);
  }

  /** Aborts the pending or in-flight search and goes idle. */
  cancel(): void {
    clearTimeout(this.#timer);
    this.#timer = undefined;
    this.#controller?.abort();
    this.#controller = null;
    this.status = 'idle';
  }
}

/** The status region's text for a search's state. */
export function statusText(
  status: AsyncStatus,
  count: number,
  { loadingText, emptyText, errorText }: { loadingText: string; emptyText: string; errorText: string },
): string {
  if (status === 'loading') return loadingText;
  if (status === 'error') return errorText;
  if (status === 'done') return count ? `${count} result${count === 1 ? '' : 's'}` : emptyText;
  return '';
}
