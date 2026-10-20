// The campus footer's content: the links every campus site shows under its own
// footer. The toolkit's <ilw-footer> fetches it from the brand API on every page
// view; ilw-ui ships a copy so the footer renders without script or network.
// Source of truth: https://api.brand.illinois.edu/footer (owned by Brand).
// Refresh with `mise run vendor:footer`.

export interface CampusLink {
  label: string;
  href: string;
}

export interface CampusFooterSection {
  label: string;
  links: CampusLink[];
}

export interface CampusFooterData {
  sections: CampusFooterSection[];
  privacy: CampusLink;
  copyright: CampusLink;
  accessibility: CampusLink;
}

// BEGIN vendor:footer (fetched 2026-10-20)
export const campusFooter: CampusFooterData = {
  "sections": [
    {
      "label": "Explore Campus",
      "links": [
        {
          "label": "University Admissions",
          "href": "https://illinois.edu/admissions/"
        },
        {
          "label": "Careers at Illinois",
          "href": "https://humanresources.illinois.edu/job-seekers/"
        },
        {
          "label": "University News",
          "href": "https://news.illinois.edu/"
        },
        {
          "label": "Visit Campus",
          "href": "https://illinois.edu/community/visit-illinois/"
        }
      ]
    },
    {
      "label": "Connect with Illinois",
      "links": [
        {
          "label": "University Alumni",
          "href": "https://uiaa.org/"
        },
        {
          "label": "Giving at Illinois",
          "href": "https://giving.illinois.edu/"
        },
        {
          "label": "Illinois Leads Strategic Plan",
          "href": "https://strategicplan.illinois.edu/"
        },
        {
          "label": "University Directory",
          "href": "https://directory.illinois.edu/search"
        }
      ]
    },
    {
      "label": "Access University Resources",
      "links": [
        {
          "label": "Emergency Services",
          "href": "https://illinois.edu/campus-emergencies/"
        },
        {
          "label": "McKinley Health Center",
          "href": "https://mckinley.illinois.edu/"
        },
        {
          "label": "Connie Frank CARE Center",
          "href": "https://odos.illinois.edu/community-of-care/CAREcenter"
        },
        {
          "label": "University Library",
          "href": "https://www.library.illinois.edu/"
        }
      ]
    }
  ],
  "privacy": {
    "label": "Privacy Policy",
    "href": "https://www.vpaa.uillinois.edu/resources/web_privacy"
  },
  "copyright": {
    "label": "Copyright",
    "href": "https://illinois.edu/copyright/"
  },
  "accessibility": {
    "label": "Accessibility",
    "href": "https://illinois.edu/about/accessibility/"
  }
};
// END vendor:footer

/** The toolkit's default UTM source for campus links. */
export const DEFAULT_FOOTER_SOURCE = 'Illinois_App';

/**
 * `href` with the campus footer's UTM parameters, as the toolkit adds them:
 * `utm_source=<source>&utm_medium=web&utm_campaign=<campaign>`.
 */
export function campusLink(href: string, source = DEFAULT_FOOTER_SOURCE, campaign = 'Footer'): string {
  const url = new URL(href);
  url.searchParams.set('utm_source', source || DEFAULT_FOOTER_SOURCE);
  url.searchParams.set('utm_medium', 'web');
  url.searchParams.set('utm_campaign', campaign);
  return url.href;
}
