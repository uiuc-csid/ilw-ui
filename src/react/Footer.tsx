// The campus footer (B3), rendering the markup documented in the README: the
// site band (site name, contact, actions, content), the campus band (wordmark
// and the campus links from ilw-ui/core's campusFooter, or the `campus` prop)
// and the legal band.
// Styled by footer.css. The CSS form of <ilw-footer>, without its runtime fetch
// and without injecting the OneTrust script. The React twin of Footer.svelte.

import type { ReactNode } from 'react';

import {
  type CampusFooterData,
  type CampusLink,
  campusFooter,
  campusLink,
  DEFAULT_FOOTER_SOURCE,
} from '../core/campus-footer.ts';
import { classNames } from '../core/class-names.ts';

export interface FooterProps {
  /** The UTM source added to the campus links (the toolkit's `source`). */
  source?: string;
  /** The campus sections and legal links; defaults to the vendored `campusFooter`. Override when Brand changes them before ilw-ui refreshes its copy. */
  campus?: CampusFooterData;
  /** Extra legal and policy links, shown before "Accessibility". */
  legalLinks?: CampusLink[];
  /** Render OneTrust's "About Cookies" button. The page loads the OneTrust script itself. */
  cookiesButton?: boolean;
  /** The social links' navigation name. */
  socialLabel?: string;
  /** The site's name, usually a link to its home page. */
  siteName: ReactNode;
  /** The primary unit, usually a link. */
  primaryUnit?: ReactNode;
  /** The contents of `<address>`: paragraphs with the postal address, email and phone. */
  address?: ReactNode;
  /** The social links, as `<li>` elements (the component writes the `nav` and `ul`). */
  social?: ReactNode;
  /** Call-to-action links or buttons. */
  actions?: ReactNode;
  /** The content area: footer menus (`nav.ilw-footer-menu`) or free HTML. */
  children?: ReactNode;
}

export function Footer({
  source = DEFAULT_FOOTER_SOURCE,
  campus = campusFooter,
  legalLinks = [],
  cookiesButton = false,
  socialLabel = 'Social media',
  siteName,
  primaryUnit,
  address,
  social,
  actions,
  children,
}: FooterProps) {
  const legal = [campus.privacy, campus.copyright, ...legalLinks, campus.accessibility];
  const href = (l: CampusLink, isCampus: boolean) => (isCampus ? campusLink(l.href, source) : l.href);
  return (
    <footer className="ilw-footer">
      <div className={classNames('ilw-footer-site', !actions && 'ilw-footer-site--no-actions')}>
        <p className="ilw-footer-site-name">{siteName}</p>
        <div className="ilw-footer-contact">
          {social && (
            <nav className="ilw-footer-social" aria-label={socialLabel}>
              <ul>{social}</ul>
            </nav>
          )}
          {address && <address className="ilw-footer-address">{address}</address>}
          {primaryUnit && <p className="ilw-footer-primary-unit">{primaryUnit}</p>}
        </div>
        {actions && <div className="ilw-footer-actions">{actions}</div>}
        {children && <div className="ilw-footer-content">{children}</div>}
      </div>
      <div className="ilw-footer-campus">
        <h2 className="ilw-footer-logo">
          <a href={campusLink('https://illinois.edu/', source)}>
            <span className="ilw-visually-hidden">University of Illinois Urbana-Champaign</span>
            <svg viewBox="0 0 151 26" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <g className="block-i">
                <path
                  className="outline"
                  d="M17.89,6.96V0H0v6.96h3.98v11.93H0v6.96h17.89v-6.96h-3.98V6.96H17.89z M13.91,19.88h2.98v4.97H0.99v-4.97h2.98c0.55,0,0.99-0.45,0.99-0.99V6.96c0-0.55-0.45-0.99-0.99-0.99H0.99V0.99h15.9v4.97h-2.98c-0.55,0-0.99,0.44-0.99,0.99v11.93C12.92,19.43,13.36,19.88,13.91,19.88"
                />
                <path
                  className="fill"
                  d="M13.91,5.96h2.98V0.99H0.99v4.97h2.98c0.55,0,0.99,0.44,0.99,0.99v11.93c0,0.55-0.45,0.99-0.99,0.99H0.99v4.97h15.9v-4.97h-2.98c-0.55,0-0.99-0.45-0.99-0.99V6.96C12.92,6.41,13.36,5.96,13.91,5.96"
                />
              </g>
              <g className="illinois">
                <path d="M31.89,22.43V3.52h4.16v18.91H31.89z" />
                <path d="M40.99,22.43V3.52h4.16v15.13h9.43v3.78H40.99z" />
                <path d="M57.62,22.43V3.52h4.16v15.13h9.43v3.78H57.62z" />
                <path d="M74.35,22.43V3.52h4.16v18.91H74.35z" />
                <path d="M96.71,22.43l-9.16-12.02v12.02h-4.11V3.52h3.84l8.86,11.64V3.52h4.11v18.91H96.71z" />
                <path
                  d="M114.21,22.76c-5.83,0-10.02-4.35-10.02-9.72v-0.05c0-5.38,4.24-9.78,10.08-9.78c5.83,0,10.02,4.35,10.02,9.72v0.05C124.28,18.35,120.04,22.76,114.21,22.76z M119.93,12.98c0-3.24-2.38-5.94-5.73-5.94c-3.35,0-5.67,2.65-5.67,5.89v0.05c0,3.24,2.38,5.94,5.73,5.94c3.35,0,5.67-2.65,5.67-5.89V12.98z"
                />
                <path d="M128.31,22.43V3.52h4.16v18.91H128.31z" />
                <path
                  d="M144.06,22.7c-2.86,0-5.75-1-8.02-3.03l2.46-2.94c1.7,1.4,3.48,2.3,5.65,2.3c1.7,0,2.73-0.68,2.73-1.78v-0.05c0-1.05-0.65-1.59-3.81-2.4c-3.81-0.97-6.27-2.03-6.27-5.78V8.95c0-3.43,2.76-5.7,6.62-5.7c2.76,0,5.11,0.86,7.02,2.4l-2.16,3.13c-1.67-1.16-3.32-1.86-4.92-1.86c-1.59,0-2.43,0.73-2.43,1.65v0.05c0,1.24,0.81,1.65,4.08,2.49c3.84,1,6,2.38,6,5.67v0.05C151,20.59,148.14,22.7,144.06,22.7z"
                />
              </g>
            </svg>
          </a>
        </h2>
        <div className="ilw-footer-sections">
          {campus.sections.map((section) => (
            <div key={section.label} className="ilw-footer-section">
              <h3>{section.label}</h3>
              <ul>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a href={href(link, true)}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="ilw-footer-legal">
        <ul>
          {cookiesButton && (
            <li>
              <button type="button" id="ot-sdk-btn" className="ot-sdk-show-settings">
                About Cookies
              </button>
            </li>
          )}
          {legal.map((link) => (
            <li key={link.href}>
              <a href={href(link, !legalLinks.includes(link))}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
