import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const announce = vi.fn();
vi.mock('../../src/core/announce.ts', () => ({ announce }));

const { copyText } = await import('../../src/core/clipboard.ts');

let written: string[];

beforeEach(() => {
  written = [];
  announce.mockClear();
  vi.stubGlobal('navigator', { clipboard: { writeText: async (text: string) => void written.push(text) } });
});

afterEach(() => vi.unstubAllGlobals());

describe('copyText', () => {
  it('writes the text and announces it politely', async () => {
    await expect(copyText('abc')).resolves.toBe(true);
    expect(written).toEqual(['abc']);
    expect(announce).toHaveBeenCalledExactlyOnceWith('Copied');
  });

  it('calls a function at copy time', async () => {
    let n = 1;
    const text = () => `row ${n}`;
    n = 2;
    await copyText(text, { copied: 'Row copied' });
    expect(written).toEqual(['row 2']);
    expect(announce).toHaveBeenCalledWith('Row copied');
  });

  it('announces a refused write assertively', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: () => Promise.reject(new DOMException('denied', 'NotAllowedError')) } });
    await expect(copyText('abc', { failed: 'No luck' })).resolves.toBe(false);
    expect(announce).toHaveBeenCalledExactlyOnceWith('No luck', { politeness: 'assertive' });
  });

  it('fails without a clipboard (insecure context)', async () => {
    vi.stubGlobal('navigator', {});
    await expect(copyText('abc')).resolves.toBe(false);
    expect(announce).toHaveBeenCalledExactlyOnceWith('Could not copy to the clipboard', { politeness: 'assertive' });
  });

  it('fails when the text function throws, without writing', async () => {
    await expect(
      copyText(() => {
        throw new Error('gone');
      }),
    ).resolves.toBe(false);
    expect(written).toEqual([]);
    expect(announce).toHaveBeenCalledWith('Could not copy to the clipboard', { politeness: 'assertive' });
  });
});
