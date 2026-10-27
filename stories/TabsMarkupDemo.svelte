<!--
  The same "Programs" section as a server template writes it (the README's
  markup), for the enhanceTabs and no-script stories. With `enhance` it is
  enhanced in place, as a page script would with enhanceAllTabs(); without, it
  is what a browser without script shows.
-->
<script lang="ts">
  import { enhanceTabs } from '../src/svelte/tabs.ts';

  let {
    enhance = true,
    automatic = false,
    hash = false,
    horizontal = false,
    selected,
  }: { enhance?: boolean; automatic?: boolean; hash?: boolean; horizontal?: boolean; selected?: string } = $props();
  let changes = $state<string[]>([]);

  function listen(el: HTMLElement) {
    const onchange = (event: Event) => changes.push((event as CustomEvent<{ id: string }>).detail.id);
    el.addEventListener('ilw-tabs-change', onchange);
    return () => el.removeEventListener('ilw-tabs-change', onchange);
  }
</script>

<h2 id="markup-heading">Programs</h2>
<p>Find the program that fits where you want to go. Each tab covers one way to study with us.</p>
<div
  class={['ilw-tabs', horizontal && 'ilw-tabs--horizontal']}
  data-labelledby="markup-heading"
  data-automatic={automatic ? '' : undefined}
  data-hash={hash ? '' : undefined}
  data-selected={selected}
  {@attach listen}
  {@attach (el) => (enhance ? enhanceTabs(el) : undefined)}
>
  <div class="ilw-tabs-container">
    <section class="ilw-tabs-panel" id="markup-degree">
      <h3 class="ilw-tabs-heading">Degree Programs</h3>
      <p>Choose from more than 150 undergraduate majors and 100 graduate and professional programs.</p>
    </section>
    <section class="ilw-tabs-panel" id="markup-non-degree">
      <h3 class="ilw-tabs-heading">Non-degree Programs</h3>
      <p>Certificates, summer sessions and courses for visiting students, on campus and online.</p>
    </section>
    <section class="ilw-tabs-panel" id="markup-classroom">
      <h3 class="ilw-tabs-heading">Classroom Experience</h3>
      <p>Small discussion sections, hands-on labs and faculty who know your name.</p>
    </section>
  </div>
</div>
<p>Changes: <span data-testid="changes">{changes.join(', ')}</span></p>
