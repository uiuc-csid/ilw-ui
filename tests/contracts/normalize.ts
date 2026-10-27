// The DOM contract normalizer: serializes what a story rendered so that the
// same markup gives the same text in every browser and from every framework
// (docs/plans/2026-10-27-react-components.md, "DOM contract snapshots").
// It reads the live DOM (computed display decides which whitespace counts)
// and never changes it.
//
// - Text: comments go, adjacent text merges, runs of [ \t\n\r\f] collapse to
//   one space (not \s: a lost &nbsp; must show). Whitespace next to a
//   block-level box (a block-level sibling, or the edge of a block-level
//   parent) is dropped, as CSS drops it; between inline boxes it stays.
// - Layout: lines break only beside a block-level box, where there is no
//   whitespace left, so a line break never hides a space. Block-level
//   elements with block-level content are indented, one child per line;
//   inline content stays on one line, exactly as spaced.
// - Attributes: sorted; `style` as its parsed declarations (cssText), sorted;
//   `class` without Svelte's scoping classes (svelte-xxxx).
// - Form state: `value`/`checked` on inputs and textareas and `selected` on
//   options are dropped; the live .value/.checked/.selected properties are
//   recorded as `.value="…"`, `.checked` and `.selected`.
// - Ids: generated ids (nextId's `prefix-N`, Svelte's `cN`, React's `_r_N_`)
//   become `prefix-{n}` and `{n}`, numbered in order of first appearance,
//   wherever they appear in an attribute: suffixed forms (`-label`, `-popup`,
//   `-0`) and references (`for`, `aria-*`, `href="#…"`, `popovertarget`, `name`)
//   follow.
// - Left out: Zag's highlighted-option announcer (`[data-live-announcer]`).
//   Zag adds it only on Apple platforms, so it isn't there on CI's Linux; the
//   Combobox and Autocomplete "Live Region" stories check where it goes.

const SVG = 'http://www.w3.org/2000/svg';
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
// SVG geometry: numbers, never ids (`c12` is a path command).
const GEOMETRY = new Set(['d', 'points', 'viewBox', 'transform']);
const SPACES = /[ \t\n\r\f]+/g;
// A generated id as a whole id, or a prefix of one (`ilw-field-3-error`).
const NEXT_ID = /^([a-z][a-z-]*?-\d+)(?=$|-)/;
// Framework ids anywhere in an attribute: Svelte's $props.id() and React's useId (19.2, 19.1, 19.0).
const FRAMEWORK_ID = /(?<![A-Za-z0-9_-])c\d+(?![A-Za-z0-9_])|_r_[0-9a-z]+_|«r[0-9a-z]+»|:r[0-9a-z]+:/g;

type Item = Element | string;

/** Elements that exist only on some platforms, so no contract can include them. */
export const PLATFORM_ONLY = '[data-live-announcer]';

/** A piece of a line: a tag or text, and whether the line may break on either side of it. */
interface Token {
  text: string;
  depth?: 1 | -1;
  breakBefore?: boolean;
  breakAfter?: boolean;
}

const escapeText = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\u00a0/g, '&nbsp;');
const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/\u00a0/g, '&nbsp;');

/**
 * A style as its parsed declarations, sorted: the CSSOM's serialization, which
 * spells values one way (`0` is `0px`) and prefers shorthands. Its longhands
 * differ by browser (WebKit adds white-space-trim to white-space).
 */
function declarations(style: CSSStyleDeclaration): string {
  return style.cssText
    .split(/;\s*(?=[-\w]+\s*:)/)
    .map((d) => d.replace(/;$/, '').trim())
    .filter(Boolean)
    .sort()
    .join('; ');
}

class Ids {
  private numbers = new Map<string, number>();
  private pattern: RegExp | null = null;

  /** Collects the generated ids under `roots` before anything is written. */
  constructor(roots: Element[]) {
    const found = new Set<string>();
    for (const root of roots) {
      for (const el of [root, ...root.querySelectorAll('*')]) {
        const nextId = NEXT_ID.exec(el.id)?.[1];
        if (nextId) found.add(nextId);
        for (const attr of el.attributes) {
          if (!GEOMETRY.has(attr.name)) for (const m of attr.value.matchAll(FRAMEWORK_ID)) found.add(m[0]);
        }
      }
    }
    if (!found.size) return;
    // Longest first, so `ilw-field-3` wins over a `field-3` inside it.
    const alternatives = [...found]
      .sort((a, b) => b.length - a.length)
      .map((b) => b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
    this.pattern = new RegExp(`(?<![A-Za-z0-9_])(?:${alternatives})(?![A-Za-z0-9_])`, 'g');
  }

  replace(value: string): string {
    if (!this.pattern) return value;
    return value.replace(this.pattern, (base) => {
      let n = this.numbers.get(base);
      if (n === undefined) this.numbers.set(base, (n = this.numbers.size + 1));
      const prefix = NEXT_ID.test(base) ? base.replace(/\d+$/, '') : '';
      return `${prefix}{${n}}`;
    });
  }
}

class Normalizer {
  private blocks = new Map<Element, boolean>();
  private contents = new Map<Element, Item[]>();
  private talls = new Map<Element, boolean>();

  constructor(private ids: Ids) {}

  blockLevel(el: Element): boolean {
    let block = this.blocks.get(el);
    if (block === undefined) {
      // Inside an SVG, whitespace is laid out only in text elements. Elsewhere display
      // decides; display: none counts as block-level, so whitespace beside a hidden
      // box doesn't separate anything.
      block =
        el.namespaceURI === SVG && el.localName !== 'svg'
          ? !/^(text|tspan|textPath)$/.test(el.localName)
          : !/^(inline|contents|ruby)/.test(getComputedStyle(el).display);
      this.blocks.set(el, block);
    }
    return block;
  }

  /** Child elements and merged, collapsed text, with whitespace next to block-level boxes dropped. */
  items(parent: Element): Item[] {
    const cached = this.contents.get(parent);
    if (cached) return cached;
    // Comments and other nodes drop out, so the text on either side of them merges.
    const raw: Item[] = [];
    for (const node of parent.childNodes) {
      const last = raw.length - 1;
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (!(node as Element).matches(PLATFORM_ONLY)) raw.push(node as Element);
      } else if (node.nodeType !== Node.TEXT_NODE) continue;
      else if (typeof raw[last] === 'string') raw[last] = raw[last] + (node as Text).data;
      else raw.push((node as Text).data);
    }
    const edge = this.blockLevel(parent);
    const out: Item[] = [];
    raw.forEach((item, i) => {
      if (typeof item !== 'string') {
        out.push(item);
        return;
      }
      let text = item.replace(SPACES, ' ');
      if (i === 0 ? edge : this.blockLevel(raw[i - 1] as Element)) text = text.replace(/^ /, '');
      if (i === raw.length - 1 ? edge : this.blockLevel(raw[i + 1] as Element)) text = text.replace(/ $/, '');
      if (text) out.push(text);
    });
    // A textarea's text is its default value; .value records what it holds.
    const content = parent instanceof HTMLTextAreaElement ? [] : out;
    this.contents.set(parent, content);
    return content;
  }

  /** Whether a block-level box sits anywhere in the element's inline content, so it spans lines. */
  tall(el: Element): boolean {
    let tall = this.talls.get(el);
    if (tall === undefined) {
      tall = this.items(el).some((c) => typeof c !== 'string' && (this.blockLevel(c) || this.tall(c)));
      this.talls.set(el, tall);
    }
    return tall;
  }

  attributes(el: Element): string {
    const formControl = el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
    const out: string[] = [];
    for (const name of el.getAttributeNames().sort()) {
      if (formControl && (name === 'value' || name === 'checked')) continue;
      if (el instanceof HTMLOptionElement && name === 'selected') continue;
      let value = el.getAttribute(name)!;
      if (name === 'class') {
        value = value
          .split(SPACES)
          .filter((c) => c && !/^svelte-[a-z0-9]+$/.test(c))
          .join(' ');
        if (!value) continue;
      } else if (name === 'style') {
        value = declarations((el as HTMLElement).style);
        if (!value) continue;
      }
      if (!GEOMETRY.has(name)) value = this.ids.replace(value);
      out.push(value === '' ? name : `${name}="${escapeAttr(value)}"`);
    }
    // Live form state, which Svelte sets as properties and React also as attributes.
    if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio') && el.checked) out.push('.checked');
    if (el instanceof HTMLOptionElement && el.selected) out.push('.selected');
    if (formControl || el instanceof HTMLSelectElement) out.push(`.value="${escapeAttr(el.value)}"`);
    return out.length ? ` ${out.join(' ')}` : '';
  }

  /** The element as tokens. A block-level element is a line of its own; a tall one also breaks inside its tags. */
  tokens(el: Element, out: Token[] = []): Token[] {
    const block = this.blockLevel(el);
    const open = `<${el.localName}${this.attributes(el)}>`;
    if (VOID.has(el.localName) && el.namespaceURI !== SVG) {
      out.push({ text: open, breakBefore: block, breakAfter: block });
      return out;
    }
    const tall = block && this.tall(el);
    out.push({ text: open, depth: 1, breakBefore: block, breakAfter: tall });
    for (const c of this.items(el)) {
      if (typeof c === 'string') out.push({ text: escapeText(c) });
      else this.tokens(c, out);
    }
    out.push({ text: `</${el.localName}>`, depth: -1, breakBefore: tall, breakAfter: block });
    return out;
  }
}

/** Lines from tokens, indented by element depth. */
function layout(tokens: Token[]): string[] {
  const lines: string[] = [];
  let line = '';
  let indent = 0;
  let depth = 0;
  let breakNext = true;
  for (const token of tokens) {
    if (token.depth === -1) depth--;
    if (breakNext || token.breakBefore) {
      if (line) lines.push('  '.repeat(indent) + line);
      line = '';
      indent = depth;
    }
    line += token.text;
    if (token.depth === 1) depth++;
    breakNext = !!token.breakAfter;
  }
  if (line) lines.push('  '.repeat(indent) + line);
  return lines;
}

/**
 * The contract text for a story: the canvas's content, then anything the
 * story added to `<body>` outside it (a modal, a popover, a live region).
 */
export function normalize(canvas: Element, outside: Element[] = []): string {
  const n = new Normalizer(new Ids([canvas, ...outside]));
  const canvasTokens = n.items(canvas).flatMap((c) => (typeof c === 'string' ? [{ text: escapeText(c) }] : n.tokens(c)));
  const lines = layout(canvasTokens);
  if (outside.length) {
    lines.push('<!-- outside the canvas, on <body> -->');
    for (const el of outside) lines.push(...layout(n.tokens(el)));
  }
  return `${lines.join('\n')}\n`;
}
