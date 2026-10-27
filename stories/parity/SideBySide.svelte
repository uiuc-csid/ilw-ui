<script lang="ts">
  type Row = { label: string; args?: Record<string, string> };

  let {
    pair,
    rows = [{ label: 'Default' }],
    theme = 'light',
    height = 200,
    holdFocus = false,
  }: {
    /** The parity file's id prefix, e.g. 'parity-button' (its stories are `<pair>--toolkit` and `<pair>--ilw-ui`). */
    pair: string;
    /** One row per variant; `args` go into each iframe's URL. */
    rows?: Row[];
    /** The toolbar's theme global, passed on so both frames match it. */
    theme?: string;
    height?: number;
    /**
     * Keep focus on this page until someone clicks or types. For pairs whose
     * stories focus something on load (Modal): only one frame on a page holds
     * focus, so whichever frame called focus() last would draw the only focus
     * ring, and which one that is changes from load to load.
     */
    holdFocus?: boolean;
  } = $props();

  // Storybook URL args/globals: key:value pairs joined by ';'.
  const encode = (o: Record<string, string>) =>
    Object.entries(o)
      .map(([k, v]) => `${k}:${v}`)
      .join(';');

  function src(side: 'toolkit' | 'ilw-ui', row: Row): string {
    const q = new URLSearchParams({ id: `${pair}--${side}`, viewMode: 'story', globals: encode({ theme }) });
    if (row.args) q.set('args', encode(row.args));
    return `iframe.html?${q}`;
  }

  // Takes focus back from any frame that takes it on its own, until the first
  // click or key press here or in a frame. The frames are same-origin.
  function holdFocusIn(root: HTMLElement) {
    if (!holdFocus) return;
    const ac = new AbortController();
    const opts = { capture: true, signal: ac.signal };
    const release = () => ac.abort();
    const listen = (w: Window | null) => {
      w?.addEventListener('pointerdown', release, opts);
      w?.addEventListener('keydown', release, opts);
    };
    listen(window);
    // This window blurs when focus moves into a frame, and the frame's element
    // is then the active one. Blurring it returns focus here in Chromium, and
    // window.focus() in WebKit. Not during the blur event itself: Chromium
    // ignores blur() until the event is over.
    window.addEventListener(
      'blur',
      () =>
        queueMicrotask(() => {
          const a = document.activeElement;
          if (!(a instanceof HTMLIFrameElement && root.contains(a))) return;
          a.blur();
          window.focus();
        }),
      opts,
    );
    for (const f of root.querySelectorAll('iframe')) f.addEventListener('load', () => listen(f.contentWindow), opts);
    return release;
  }
</script>

<!-- Each side is its own document, so toolkit.css and ilw-ui's styles.css
     (same class names) never meet. For people; tests use the pair stories. -->
<div class="side-by-side" {@attach holdFocusIn}>
  <div class="head">Toolkit</div>
  <div class="head">ilw-ui</div>
  {#each rows as row (row.label)}
    <div class="label">{row.label}</div>
    {#each ['toolkit', 'ilw-ui'] as const as side (side)}
      <iframe title="{row.label}, {side}" src={src(side, row)} {height} loading="lazy"></iframe>
    {/each}
  {/each}
</div>

<style>
  .side-by-side {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.25rem 1rem;
    font-family: var(--il-font-sans, 'Source Sans 3', sans-serif);
  }

  .head {
    font-weight: 700;
    font-size: 1.25rem;
  }

  .label {
    grid-column: 1 / -1;
    margin-top: 0.75rem;
    font-weight: 700;
  }

  iframe {
    width: 100%;
    border: 1px solid var(--il-storm-60, #8e9090);
  }
</style>
