# Illinois Web Toolkit (vendored)

`toolkit.js` and `toolkit.css` are a pinned copy of the Illinois Web Toolkit v3
(https://builder3.toolkit.illinois.edu/). Storybook serves them at `/toolkit/`.
The CDN sits behind a WAF that CAPTCHA-blocks automated browsers, so the test
suite must never load it.

Fetched 2026-10-16 from `https://cdn.toolkit.illinois.edu/3/toolkit.{js,css}`.

**Why not npm:** the toolkit is published only as per-component packages
(`@illinois-toolkit/ilw-modal`, `@illinois-toolkit/ilw-page`, …); there is no
npm package for the combined bundle consumers load from the CDN. Vendoring that
bundle tests against exactly what consuming pages run.

One local edit: `toolkit.css` refers to `../svg/*.svg` relative to the CDN.
Those are rewritten to absolute CDN URLs, where they resolved before.

To update: `mise run vendor:toolkit` (it reapplies that edit), check the stories
in `pnpm storybook`, run `mise run test`, and update the date above.

The toolkit still loads the brand stylesheet from `cdn.brand.illinois.edu`.
