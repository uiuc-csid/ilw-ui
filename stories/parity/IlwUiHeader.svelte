<!--
  The ilw-ui side of the Header parity pair: `Header` with the same sample
  content as ToolkitHeader.
-->
<script lang="ts">
  import Header from '../../src/svelte/Header.svelte';
  import { menu, megamenu, parentUnit, utilityLinks } from '../header-sample.ts';

  let { mega = false }: { mega?: boolean } = $props();
</script>

<Header
  siteName="Component Builder"
  siteHref="#home"
  {parentUnit}
  source="ilw_ui"
  links={utilityLinks}
  search={{ action: '#search' }}
  nav={mega ? megamenu : menu}
  megamenu={mega}
/>
