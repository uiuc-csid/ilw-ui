// Play functions for the footer stories, shared by the Svelte and React twins.

import type { PlayFunctionContext, WebRenderer } from 'storybook/internal/types';
import { expect, within } from 'storybook/test';

import { campusFooter } from '../../src/core/index.ts';

/** Parity/Footer → IlwUi: the bands, the campus links, the legal row and the landmark names. */
export async function parity({ canvas, canvasElement }: PlayFunctionContext<WebRenderer>) {
  const footer = canvas.getByRole('contentinfo');
  for (const band of ['site', 'campus', 'legal']) {
    await expect(footer.querySelector(`:scope > .ilw-footer-${band}`)).not.toBeNull();
  }
  await expect(canvas.getByRole('navigation', { name: 'Social media' })).toBeInTheDocument();
  await expect(canvas.getByRole('navigation', { name: 'Resources' })).toBeInTheDocument();
  await expect(canvasElement.querySelector('address.ilw-footer-address')).not.toBeNull();

  // The wordmark link is named, and its SVG is hidden.
  const home = canvas.getByRole('link', { name: 'University of Illinois Urbana-Champaign' });
  await expect(home).toHaveAttribute('href', 'https://illinois.edu/?utm_source=ilw_ui&utm_medium=web&utm_campaign=Footer');
  await expect(home.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');

  // Every campus section and link, with the UTM source.
  const campus = within(footer.querySelector<HTMLElement>('.ilw-footer-campus')!);
  for (const section of campusFooter.sections) {
    await expect(campus.getByRole('heading', { level: 3, name: section.label })).toBeInTheDocument();
    for (const link of section.links) {
      const a = campus.getByRole('link', { name: link.label });
      await expect(a.getAttribute('href')).toContain('utm_source=ilw_ui');
    }
  }

  // Legal row: cookies, privacy, copyright, the site's own links, accessibility.
  const legal = footer.querySelector<HTMLElement>('.ilw-footer-legal')!;
  const items = [...legal.querySelectorAll('li')].map((li) => li.textContent?.trim());
  await expect(items).toEqual(['About Cookies', 'Privacy Policy', 'Copyright', 'Terms of use', 'Accessibility']);
  await expect(within(legal).getByRole('link', { name: 'Terms of use' })).toHaveAttribute('href', '#terms');
  await expect(within(legal).getByRole('button', { name: 'About Cookies' })).toHaveClass('ot-sdk-show-settings');

  // The toolkit's bands.
  const bg = (sel: string) => getComputedStyle(footer.querySelector(sel)!).backgroundColor;
  await expect(bg('.ilw-footer-site')).toBe('rgb(244, 244, 244)');
  await expect(bg('.ilw-footer-campus')).toBe('rgb(19, 41, 75)');
  await expect(bg('.ilw-footer-legal')).toBe('rgb(19, 41, 75)');
}

/** Parity/Footer → Site Name Only: no actions, social links or cookies button. */
export async function siteNameOnly({ canvasElement }: PlayFunctionContext<WebRenderer>) {
  await expect(canvasElement.querySelector('.ilw-footer-site')).toHaveClass('ilw-footer-site--no-actions');
  await expect(canvasElement.querySelector('.ilw-footer-social')).toBeNull();
  await expect(canvasElement.querySelector('.ilw-footer-legal button')).toBeNull();
}

/** Parity/Footer → Campus Override: `campus` replaces the sections and the legal links. */
export async function campusOverride({ canvasElement }: PlayFunctionContext<WebRenderer>) {
  const footer = within(canvasElement.querySelector<HTMLElement>('footer')!);
  const sections = canvasElement.querySelectorAll('.ilw-footer-section');
  await expect(sections).toHaveLength(1);
  await expect(footer.getByRole('heading', { level: 3, name: 'Override Section' })).toBeInTheDocument();
  await expect(footer.getByRole('link', { name: 'Override Link' })).toHaveAttribute(
    'href',
    'https://example.illinois.edu/?utm_source=Illinois_App&utm_medium=web&utm_campaign=Footer',
  );
  const legal = [...canvasElement.querySelectorAll('.ilw-footer-legal a')].map((a) => a.textContent);
  await expect(legal).toEqual(['Override Privacy', 'Override Copyright', 'Override Accessibility']);
}
