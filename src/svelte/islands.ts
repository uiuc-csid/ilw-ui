import { type Component, mount, unmount } from 'svelte';

/** Maps a `data-ilw-island` name to the component mounted there. */
export type IslandRegistry = Record<string, Component<any>>;

const MOUNTED = 'data-ilw-mounted';

// Elements already reported, so a bad host logs once however often mountIslands runs.
const reported = new WeakSet<Element>();

function report(el: Element, message: string, error?: unknown): void {
  if (reported.has(el)) return;
  reported.add(el);
  console.error(`ilw-ui mountIslands: ${message}`, ...(error === undefined ? [] : [error]), el);
}

/** Parses a props JSON string. Only plain objects are props; anything else is an error. */
export function parseProps(json: string): { ok: true; props: Record<string, unknown> } | { ok: false; error: string } {
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return { ok: false, error: 'props must be a JSON object' };
  }
  return { ok: true, props: value as Record<string, unknown> };
}

/**
 * Reads an island host's props: `data-props` (JSON), or `data-props-id` naming a
 * `<script type="application/json">` (Django's `json_script`). No attribute means no props.
 */
export function readProps(el: Element): ReturnType<typeof parseProps> {
  const inline = el.getAttribute('data-props');
  if (inline !== null) return parseProps(inline);
  const id = el.getAttribute('data-props-id');
  if (id === null) return { ok: true, props: {} };
  const script = el.ownerDocument.getElementById(id);
  if (!script || script.tagName !== 'SCRIPT' || script.getAttribute('type') !== 'application/json') {
    return { ok: false, error: `data-props-id="${id}" does not name a <script type="application/json">` };
  }
  return parseProps(script.textContent ?? '');
}

/**
 * Mounts `registry[name]` on every `[data-ilw-island="name"]` under `root` that isn't mounted yet.
 * Bad props or an unknown name are logged and skipped; this never throws. Returns a function that
 * unmounts what this call mounted. On a `pagehide` that isn't going into the bfcache, it unmounts
 * by itself.
 */
export function mountIslands(registry: IslandRegistry, root: ParentNode = document): () => void {
  const mounted: { el: Element; instance: Record<string, any> }[] = [];

  for (const el of root.querySelectorAll(`[data-ilw-island]:not([${MOUNTED}])`)) {
    const name = el.getAttribute('data-ilw-island') ?? '';
    const component = Object.hasOwn(registry, name) ? registry[name] : undefined;
    if (!component) {
      report(el, `no component registered as "${name}"`);
      continue;
    }
    const result = readProps(el);
    if (!result.ok) {
      report(el, `bad props for "${name}": ${result.error}`);
      continue;
    }
    try {
      mounted.push({ el, instance: mount(component, { target: el, props: result.props }) });
      el.setAttribute(MOUNTED, '');
    } catch (e) {
      report(el, `"${name}" failed to mount`, e);
    }
  }

  // A Document has no ownerDocument; an element under it does.
  const view = ((root as Node).ownerDocument ?? (root as Document)).defaultView;
  let done = false;
  const onPagehide = (event: PageTransitionEvent) => {
    // A persisted page comes back from the bfcache as it was, islands included.
    if (!event.persisted) teardown();
  };
  function teardown(): void {
    if (done) return;
    done = true;
    view?.removeEventListener('pagehide', onPagehide);
    for (const { el, instance } of mounted) {
      void unmount(instance);
      el.removeAttribute(MOUNTED);
    }
    mounted.length = 0;
  }
  if (mounted.length) view?.addEventListener('pagehide', onPagehide);
  return teardown;
}
