import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// A minimal DOM: node has none, and announce() needs only these pieces.
class FakeElement {
  attrs: Record<string, string> = {};
  dataset: Record<string, string> = {};
  className = '';
  textContent = '';
  isConnected = false;
  setAttribute(name: string, value: string) {
    this.attrs[name] = value;
  }
}

let body: FakeElement[];
let frames: Map<number, FrameRequestCallback>;
let nextFrame: number;

function flush() {
  const due = [...frames.values()];
  frames.clear();
  for (const cb of due) cb(0);
}

async function load() {
  vi.resetModules();
  return import('../../src/core/announce.ts');
}

beforeEach(() => {
  body = [];
  frames = new Map();
  nextFrame = 1;
  vi.stubGlobal('document', {
    createElement: () => new FakeElement(),
    body: {
      append: (el: FakeElement) => {
        el.isConnected = true;
        body.push(el);
      },
    },
  });
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    frames.set(nextFrame, cb);
    return nextFrame++;
  });
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id));
});

afterEach(() => vi.unstubAllGlobals());

describe('announce', () => {
  it('touches no DOM at import', async () => {
    await load();
    expect(body).toEqual([]);
  });

  it('creates a status and an alert region once, and reuses them', async () => {
    const { announce } = await load();
    announce('a');
    announce('b', { politeness: 'assertive' });
    announce('c');
    announce('d', { politeness: 'assertive' });
    expect(body.map((el) => el.attrs.role)).toEqual(['status', 'alert']);
    for (const el of body) {
      expect(el.className).toBe('ilw-visually-hidden');
      expect(el.attrs['aria-atomic']).toBe('true');
    }
  });

  it('clears now and sets the text on the next frame', async () => {
    const { announce } = await load();
    announce('Saved');
    flush();
    const [status] = body;
    expect(status.textContent).toBe('Saved');
    announce('Saved');
    expect(status.textContent).toBe('');
    flush();
    expect(status.textContent).toBe('Saved');
  });

  it('replaces a message that has not been set yet', async () => {
    const { announce } = await load();
    announce('first');
    announce('second');
    expect(frames.size).toBe(1);
    flush();
    expect(body[0].textContent).toBe('second');
  });

  it('keeps polite and assertive messages apart', async () => {
    const { announce } = await load();
    announce('quiet');
    announce('loud', { politeness: 'assertive' });
    flush();
    expect(body.map((el) => el.textContent)).toEqual(['quiet', 'loud']);
  });

  it('recreates a region that left the page', async () => {
    const { announce } = await load();
    announce('a');
    body[0].isConnected = false;
    announce('b');
    expect(body).toHaveLength(2);
    flush();
    expect(body[1].textContent).toBe('b');
  });
});
