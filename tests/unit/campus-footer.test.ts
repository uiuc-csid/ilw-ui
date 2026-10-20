import { describe, expect, it } from 'vitest';

import { campusFooter, campusLink } from '../../src/core/index.ts';

describe('campusLink', () => {
  it('adds the toolkit footer UTM parameters', () => {
    expect(campusLink('https://illinois.edu/copyright/')).toBe(
      'https://illinois.edu/copyright/?utm_source=Illinois_App&utm_medium=web&utm_campaign=Footer',
    );
  });

  it('uses the given source and campaign, and falls back on an empty source', () => {
    expect(campusLink('https://illinois.edu/', 'CS_Site', 'Header')).toBe(
      'https://illinois.edu/?utm_source=CS_Site&utm_medium=web&utm_campaign=Header',
    );
    expect(campusLink('https://illinois.edu/', '')).toContain('utm_source=Illinois_App');
  });

  it('keeps an existing query string', () => {
    expect(campusLink('https://directory.illinois.edu/search?q=x')).toBe(
      'https://directory.illinois.edu/search?q=x&utm_source=Illinois_App&utm_medium=web&utm_campaign=Footer',
    );
  });
});

describe('campusFooter', () => {
  it('has the brand API shape: sections of links, and the three legal links', () => {
    expect(campusFooter.sections.length).toBeGreaterThan(0);
    for (const s of campusFooter.sections) {
      expect(s.label).not.toBe('');
      for (const l of s.links) expect(new URL(l.href).protocol).toBe('https:');
    }
    for (const l of [campusFooter.privacy, campusFooter.copyright, campusFooter.accessibility]) {
      expect(new URL(l.href).protocol).toBe('https:');
    }
  });
});
