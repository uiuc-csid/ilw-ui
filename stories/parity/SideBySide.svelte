<script lang="ts">
  type Row = { label: string; args?: Record<string, string> };

  let {
    pair,
    rows = [{ label: 'Default' }],
    theme = 'light',
    height = 200,
  }: {
    /** The parity file's id prefix, e.g. 'parity-button' (its stories are `<pair>--toolkit` and `<pair>--ilw-ui`). */
    pair: string;
    /** One row per variant; `args` go into each iframe's URL. */
    rows?: Row[];
    /** The toolbar's theme global, passed on so both frames match it. */
    theme?: string;
    height?: number;
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
</script>

<!-- Each side is its own document, so toolkit.css and ilw-ui's styles.css
     (same class names) never meet. For people; tests use the pair stories. -->
<div class="side-by-side">
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
