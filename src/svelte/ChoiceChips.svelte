<!--
  Choice chips (E5), rendering the markup documented in the README: a fieldset
  whose legend names the group, each option a native radio (or, with
  `multiple`, checkbox) inside a label.ilw-chip, then help text and an error.
  As in RadioGroup, the radios' fieldset has role="radiogroup" so it can carry
  aria-invalid; a checkbox group stays a plain group (which can't), so each
  checkbox carries it instead. Styled by chips.css.
-->
<script module lang="ts">
  export interface ChipOption {
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
    multiple = false,
    value = $bindable(),
    description,
    error,
    required = false,
    id = nextId('ilw-chips'),
    descriptionId = `${id}-description`,
    errorId = `${id}-error`,
    class: className = '',
    onchange,
  }: {
    /** The legend's content: the group's name. */
    legend: string | Snippet;
    /** The inputs' `name`, submitted with the form. */
    name: string;
    options: ChipOption[];
    /** Checkboxes (pick any) instead of radios (pick one). */
    multiple?: boolean;
    /** The checked value (radios; undefined for none) or values (checkboxes). Bindable. */
    value?: string | string[];
    /** Help text under the chips, read as the group's description. */
    description?: string | Snippet;
    /** The error message. Set means invalid: `aria-invalid="true"` on the radiogroup, or on each checkbox. */
    error?: string | Snippet;
    /** The legend's "*" marker; also native `required` on each radio (a checkbox group has no native "at least one"). */
    required?: boolean;
    /** The fieldset's id. */
    id?: string;
    descriptionId?: string;
    errorId?: string;
    /** More classes on the fieldset. */
    class?: string;
    /** Called with the new value (a string for radios, an array for checkboxes) when the user changes it. */
    onchange?: (value: string | string[]) => void;
  } = $props();

  const describedby = $derived([description && descriptionId, error && errorId].filter(Boolean).join(' ') || undefined);
  const values = $derived(Array.isArray(value) ? value : value === undefined ? [] : [value]);

  function change(option: ChipOption, checked: boolean) {
    if (multiple) {
      value = checked ? [...values, option.value] : values.filter((v) => v !== option.value);
    } else {
      value = option.value;
    }
    onchange?.(value);
  }
</script>

<fieldset
  class={['ilw-chips', className]}
  {id}
  role={multiple ? undefined : 'radiogroup'}
  aria-describedby={describedby}
  aria-invalid={error && !multiple ? 'true' : undefined}
>
  <legend class={{ 'ilw-label-required': required }}>{#if typeof legend === 'string'}{legend}{:else}{@render legend()}{/if}</legend>
  {#each options as option (option.value)}
    <label class="ilw-chip"
      ><input
        type={multiple ? 'checkbox' : 'radio'}
        {name}
        value={option.value}
        checked={values.includes(option.value)}
        disabled={option.disabled}
        required={(required && !multiple) || undefined}
        aria-invalid={error && multiple ? 'true' : undefined}
        onchange={(e) => change(option, e.currentTarget.checked)}
      />{option.label}</label
    >
  {/each}
  {#if description}
    <p class="ilw-input-description" id={descriptionId}>{#if typeof description === 'string'}{description}{:else}{@render description()}{/if}</p>
  {/if}
  {#if error}
    <p class="ilw-input-alert" id={errorId}>{#if typeof error === 'string'}{error}{:else}{@render error()}{/if}</p>
  {/if}
</fieldset>
