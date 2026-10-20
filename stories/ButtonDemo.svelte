<script lang="ts">
  import { Button } from '../src/svelte/index.ts';

  let pressed = $state(0);
  let disabledPressed = $state(0);
</script>

<!-- Both forms, enabled and disabled, between two native controls, so a test
     can Tab through and see which ones are skipped. -->
<p>
  <button type="button">Before</button>
  <Button href="#button-demo-target">Link button</Button>
  <Button onclick={() => pressed++}>Plain button</Button>
  <Button disabled onclick={() => disabledPressed++}>Disabled button</Button>
  <Button href="#button-demo-target" disabled onclick={() => disabledPressed++}>Disabled link</Button>
  <button type="button">After</button>
</p>
<p>Plain button pressed: <output data-testid="pressed">{pressed}</output></p>
<p>Disabled controls pressed: <output data-testid="disabled-pressed">{disabledPressed}</output></p>
<!-- tabindex="-1": following the link moves focus here instead of to <body>. -->
<p id="button-demo-target" tabindex="-1">The link's target.</p>
