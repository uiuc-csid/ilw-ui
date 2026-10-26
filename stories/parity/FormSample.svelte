<!--
  A trimmed copy of upstream's samples/variations.html (web-illinois/ilw-input),
  in either side's markup. The toolkit side is upstream's own markup inside
  <ilw-content>; the ilw-ui side differs only where the README says it does:
  radio groups are fieldset + legend, the switch is input.ilw-switch, help text
  is p.ilw-input-description, the required marker is written by the template.
-->
<script lang="ts">
  let { side }: { side: 'toolkit' | 'ilw-ui' } = $props();

  const radios = ['First Item', 'Second Item', 'Third Item'];
  const variants = ['radio', 'radio-vertical', 'radio-compact', 'radio-vertical-compact'] as const;
  const help = 'Some explanatory text which might get long.';
</script>

{#snippet radioGroup(variant: (typeof variants)[number])}
  {@const name = `${side}-${variant}`}
  {@const title = `${variant.includes('vertical') ? 'Vertical ' : ''}Radio Buttons Title`}
  {#if side === 'toolkit'}
    <div class="ilw-input-entry-{variant}">
      <p>{title}</p>
      {#each radios as item, i (item)}
        <input type="radio" id="{name}-{i}" {name} value={i} /><label for="{name}-{i}">{item}</label>
      {/each}
    </div>
  {:else}
    <fieldset class="ilw-input-entry-{variant}">
      <legend>{title}</legend>
      {#each radios as item, i (item)}
        <input type="radio" id="{name}-{i}" {name} value={i} /><label for="{name}-{i}">{item}</label>
      {/each}
    </fieldset>
  {/if}
{/snippet}

{#snippet sample()}
  <form>
    <div class="ilw-input-entry">
      <label for="{side}-text">Text Box</label>
      <input id="{side}-text" type="text" />
    </div>
    <div class="ilw-input-entry">
      <label for="{side}-short">Short Text Box</label>
      <input id="{side}-short" type="text" class="ilw-input-short" />
    </div>
    <div class="ilw-input-entry">
      <label for="{side}-long">Long Text Box With Instructions</label>
      {#if side === 'toolkit'}
        <input id="{side}-long" type="text" class="ilw-input-long" />
        <p>{help}</p>
      {:else}
        <input id="{side}-long" type="text" class="ilw-input-long" aria-describedby="{side}-long-description" />
        <p class="ilw-input-description" id="{side}-long-description">{help}</p>
      {/if}
    </div>
    <div class="ilw-input-entry">
      <!-- Upstream's script adds the class to the label of a :required control. -->
      <label for="{side}-required" class={side === 'ilw-ui' ? 'ilw-label-required' : undefined}>Required Text Box</label>
      <input id="{side}-required" type="text" required />
    </div>
    <div class="ilw-input-entry">
      <label for="{side}-area">Text Area</label>
      <textarea id="{side}-area"></textarea>
    </div>
    <div class="ilw-input-entry">
      <label for="{side}-select">Dropdown</label>
      <select id="{side}-select">
        <option value="">Choose one</option>
        <option value="1">First Item</option>
      </select>
    </div>
    <div class="ilw-input-entry-checkbox">
      <label for="{side}-checkbox">Checkbox</label>
      <input id="{side}-checkbox" type="checkbox" checked />
    </div>
    {@render radioGroup('radio')}
    {@render radioGroup('radio-vertical')}
    <div class="ilw-input-entry">
      <label for="{side}-toggle">Toggle Checkbox</label>
      {#if side === 'toolkit'}
        <div class="ilw-toggle-slider">
          <input id="{side}-toggle" type="checkbox" role="switch" /><span
            ><span class="ilw-container"></span><span aria-hidden="true" class="ilw-text-on">On</span><span
              aria-hidden="true"
              class="ilw-text-off">Off</span
            ></span
          >
        </div>
      {:else}
        <input id="{side}-toggle" type="checkbox" role="switch" class="ilw-switch" />
      {/if}
    </div>

    <h2>Compact Versions</h2>
    <div class="ilw-input-entry-compact">
      <label for="{side}-text-c">Text Box</label>
      <input id="{side}-text-c" type="text" />
    </div>
    <div class="ilw-input-entry-compact">
      <label for="{side}-help-c">Text Box With Instructions</label>
      {#if side === 'toolkit'}
        <input id="{side}-help-c" type="text" />
        <p>{help}</p>
      {:else}
        <input id="{side}-help-c" type="text" aria-describedby="{side}-help-c-description" />
        <p class="ilw-input-description" id="{side}-help-c-description">{help}</p>
      {/if}
    </div>
    <div class="ilw-input-entry-checkbox-compact">
      <label for="{side}-checkbox-c">Checkbox</label>
      <input id="{side}-checkbox-c" type="checkbox" />
    </div>
    {@render radioGroup('radio-compact')}
    {@render radioGroup('radio-vertical-compact')}

    <h2>Misc</h2>
    <div class="ilw-input-disclaimer">
      <input id="{side}-disclaimer" type="checkbox" />
      <label for="{side}-disclaimer">The opinions and referrals on this website are for information only.</label>
    </div>
    <fieldset class={side === 'ilw-ui' ? 'ilw-fieldset' : undefined}>
      <legend>Field Set Title</legend>
      <div class="ilw-input-entry">
        <label for="{side}-fname">First name</label>
        <input type="text" id="{side}-fname" class="ilw-input-long" />
      </div>
    </fieldset>
    <div class="ilw-input-alert">Alert for forms</div>
  </form>
{/snippet}

{#if side === 'toolkit'}
  <ilw-content>{@render sample()}</ilw-content>
{:else}
  {@render sample()}
{/if}
