<!--
  Spacer (A5), rendering the markup documented in the README: an empty,
  hidden block of vertical space. Styled by spacer.css.
-->
<script lang="ts">
  let {
    height,
  }: {
    /** Any CSS length (the toolkit's `height`); unset is spacer.css's 20px. */
    height?: string;
  } = $props();
</script>

<div class="ilw-spacer" aria-hidden="true" style:--ilw-spacer--height={height}></div>
