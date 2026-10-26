<!--
  A radio group (A7), rendering the markup documented in the README: a
  fieldset whose legend names the group, the options, help text and an error.
  The fieldset has role="radiogroup" (still named by its legend), which, unlike
  a plain group or a radio, allows aria-invalid; it lists the help text and
  error in aria-describedby.
  Styled by forms.css.
-->
<script module lang="ts">
  export interface RadioOption {
    value: string;
    label: string;
    disabled?: boolean;
  }
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  import { nextId } from '../core/index.ts';

  let {
    legend,
    name,
    options,
    value = $bindable(),
    description,
    error,
    required = false,
    layout = 'stacked',
    compact = false,
    id = nextId('ilw-radio-group'),
    descriptionId = `${id}-description`,
    errorId = `${id}-error`,
    class: className = '',
    onchange,
  }: {
    /** The legend's content: the group's name. */
    legend: string | Snippet;
    /** The radios' `name`, submitted with the form. */
    name: string;
    options: RadioOption[];
    /** The checked option's value (bindable); undefined for none. */
    value?: string;
    /** Help text under the options, read as the group's description. */
    description?: string | Snippet;
    /** The error message. Set means invalid: the group gets `aria-invalid="true"`. */
    error?: string | Snippet;
    /** Adds `required` to the radios and the "*" marker to the legend. */
    required?: boolean;
    /** `'stacked'` (one per line) or `'across'` (in columns, upstream's "vertical"). */
    layout?: 'stacked' | 'across';
    /** The compact layout: the legend in a column beside the options. */
    compact?: boolean;
    /** The fieldset's id; option `i`'s id is `<id>-<i>`. */
    id?: string;
    descriptionId?: string;
    errorId?: string;
    /** More classes on the fieldset. */
    class?: string;
    /** Called with the new value when the user picks an option. */
    onchange?: (value: string) => void;
  } = $props();

  const describedby = $derived([description && descriptionId, error && errorId].filter(Boolean).join(' ') || undefined);
  const entry = $derived(`ilw-input-entry-radio${layout === 'across' ? '-vertical' : ''}${compact ? '-compact' : ''}`);
</script>

<fieldset
  class={[entry, className]}
  {id}
  role="radiogroup"
  aria-describedby={describedby}
  aria-invalid={error ? 'true' : undefined}
>
  <legend class={{ 'ilw-label-required': required }}>{#if typeof legend === 'string'}{legend}{:else}{@render legend()}{/if}</legend>
  {#each options as option, i (option.value)}
    <input
      type="radio"
      id="{id}-{i}"
      {name}
      value={option.value}
      bind:group={value}
      disabled={option.disabled}
      required={required || undefined}
      onchange={() => onchange?.(option.value)}
    /><label for="{id}-{i}">{option.label}</label>
  {/each}
  {#if description}
    <p class="ilw-input-description" id={descriptionId}>{#if typeof description === 'string'}{description}{:else}{@render description()}{/if}</p>
  {/if}
  {#if error}
    <p class="ilw-input-alert" id={errorId}>{#if typeof error === 'string'}{error}{:else}{@render error()}{/if}</p>
  {/if}
</fieldset>
