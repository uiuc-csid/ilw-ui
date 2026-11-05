<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import Footer from '../../src/svelte/Footer.svelte';
  import * as plays from '../plays/footer.ts';
  import SideBySide from './SideBySide.svelte';

  // No autodocs: a Docs page renders every story in one document, and the two
  // sides of a pair need different stylesheets. A footer is page-level (a
  // content-info landmark), so neither side goes inside the Storybook <main>.
  const { Story } = defineMeta({ title: 'Parity/Footer', parameters: { shell: false } });
</script>

<!--
  `<ilw-footer>` with every slot filled, styled by the vendored toolkit only. It fetches the campus links from `api.brand.illinois.edu` when it loads. It supplies its own cookies button, so the toolkit doesn't inject the OneTrust script.

  **Why:** the reference for the ilw-ui side. Its axe check is off: this documents upstream, it isn't our code.

  **Review:** compare with **IlwUi** or **Side By Side**.
-->
<Story name="Toolkit" parameters={{ styles: 'toolkit', a11y: { test: 'off' } }}>
  <ilw-footer source="ilw_ui">
    <p slot="site-name"><a href="#home">Computer Science</a></p>
    <nav slot="social" aria-label="Social media">
      <ul>
        <li><a href="#bluesky">Bluesky</a></li>
        <li><a href="#youtube">YouTube</a></li>
      </ul>
    </nav>
    <address slot="address">
      <p>201 North Goodwin Avenue<br />Urbana, IL 61801</p>
      <p>Email: <a href="mailto:cs@example.com">cs@example.com</a></p>
      <p>Phone: <a href="tel:+12175550000" aria-label="Computer Science office">(217) 555-0000</a></p>
    </address>
    <p slot="primary-unit"><a href="#grainger">The Grainger College of Engineering</a></p>
    <div slot="actions"><a href="#give">Give</a> <a href="#apply">Apply</a></div>
    <nav class="ilw-footer-menu" aria-labelledby="tk-menu-1">
      <h2 id="tk-menu-1">Resources</h2>
      <ul>
        <li><a href="#a">Advising</a></li>
        <li><a href="#b">Course explorer</a></li>
      </ul>
    </nav>
    <button slot="cookies-button" id="ot-sdk-btn" class="ot-sdk-show-settings ilw-button">About Cookies</button>
    <a href="#terms" slot="legal-link">Terms of use</a>
  </ilw-footer>
</Story>

<!--
  `Footer` with the same content, styled by ilw-ui's `footer.css` only. The campus links come from `campusFooter` in `ilw-ui/core`, not the network.

  **Why:** the play function checks the footer's contract: the three bands, the campus links with their UTM parameters, the legal links in the toolkit's order, and the landmark names. axe checks the colours.

  **Review:** matches **Toolkit**: the gray site band with a blue rule, the blue campus band with an orange rule, the legal row. Narrow the window: the campus sections go from three columns to two to one, and the site band stacks.
-->
<Story name="IlwUi" parameters={{ styles: 'ilw-ui' }} play={plays.parity}>
  <Footer source="ilw_ui" cookiesButton legalLinks={[{ label: 'Terms of use', href: '#terms' }]}>
    {#snippet siteName()}<a href="#home">Computer Science</a>{/snippet}
    {#snippet social()}
      <li><a href="#bluesky">Bluesky</a></li>
      <li><a href="#youtube">YouTube</a></li>
    {/snippet}
    {#snippet address()}
      <p>201 North Goodwin Avenue<br />Urbana, IL 61801</p>
      <p>Email: <a href="mailto:cs@example.com">cs@example.com</a></p>
      <p>Phone: <a href="tel:+12175550000">(217) 555-0000</a></p>
    {/snippet}
    {#snippet primaryUnit()}<a href="#grainger">The Grainger College of Engineering</a>{/snippet}
    {#snippet actions()}<a href="#give">Give</a> <a href="#apply">Apply</a>{/snippet}
    <nav class="ilw-footer-menu" aria-labelledby="menu-1">
      <h2 id="menu-1">Resources</h2>
      <ul>
        <li><a href="#a">Advising</a></li>
        <li><a href="#b">Course explorer</a></li>
      </ul>
    </nav>
  </Footer>
</Story>

<!--
  The smallest footer: a site name only.

  **Why:** without actions, the content area moves up beside the site name (`ilw-footer-site--no-actions`); the campus and legal bands are always there.

  **Review:** a gray band with just the site name, then the campus and legal bands.
-->
<Story name="Site Name Only" parameters={{ styles: 'ilw-ui' }} play={plays.siteNameOnly}>
  <Footer>
    {#snippet siteName()}Sample Site{/snippet}
  </Footer>
</Story>

<!--
  The campus content passed in through `campus`, replacing the vendored copy.

  **Why:** Brand can change the campus links before ilw-ui refreshes `campusFooter`; an app overrides them without waiting for a release. The play function checks the override replaces the sections and the legal links, and keeps the UTM parameters.

  **Review:** one campus section, "Override Section", and the legal row's privacy, copyright and accessibility links read "Override …".
-->
<Story name="Campus Override" parameters={{ styles: 'ilw-ui' }} play={plays.campusOverride}>
  <Footer
    campus={{
      sections: [
        { label: 'Override Section', links: [{ label: 'Override Link', href: 'https://example.illinois.edu/' }] },
      ],
      privacy: { label: 'Override Privacy', href: 'https://example.illinois.edu/privacy' },
      copyright: { label: 'Override Copyright', href: 'https://example.illinois.edu/copyright' },
      accessibility: { label: 'Override Accessibility', href: 'https://example.illinois.edu/accessibility' },
    }}
  >
    {#snippet siteName()}Sample Site{/snippet}
  </Footer>
</Story>

<!--
  Both sides, each in its own iframe.

  **Why:** the two stylesheets share class names, so they can't be compared in one document. Not a test (`!test`, axe off): its frames are the two stories above, which are tested themselves.

  **Review:** the same bands, links and spacing on both sides. The footer keeps its brand colours under the Dark toolbar setting, as upstream.
-->
<Story name="Side By Side" tags={['!test']} parameters={{ styles: 'ilw-ui', shell: true, a11y: { test: 'off' } }}>
  {#snippet template(_args, context)}
    <SideBySide pair="parity-footer" theme={String(context.globals.theme ?? 'light')} height={1100} />
  {/snippet}
</Story>
