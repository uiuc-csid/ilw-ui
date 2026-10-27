<!--
  A toggle group (E4), rendering the markup documented in the README: a
  role="group" of .ilw-button buttons with aria-pressed, named by a visible
  label or by aria-label/aria-labelledby. Single-select by default; `multiple`
  lets each button toggle on its own. Every button is a plain Tab stop.
  Styled by toggle-group.css and button.css.
-->
<script module lang="ts">
  export interface ToggleOption {
    value: string;
    label: string;
    disabled?: boolean;
  }
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  import { nextId } from '../core/index.ts';
  import type { ButtonSize, ButtonTheme } from './Button.svelte';

  type Common = {
    options: ToggleOption[];
    /** A visible label, before the buttons; it names the group. Without it, pass `aria-label` or `aria-labelledby`. */
    label?: string | Snippet;
    size?: ButtonSize;
    theme?: ButtonTheme;
    /** The group's id; the visible label's id is `<id>-label`. */
    id?: string;
    /** More classes on the group. */
    class?: string;
  } & Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'id' | 'onchange' | 'role'>;
  type Single = Common & {
    multiple?: false;
    /** The pressed option's value (bindable); undefined for none. */
    value?: string;
    /** Pressing the pressed button releases it, leaving none pressed. */
    allowNone?: boolean;
    /** Called with the new value when the user changes it. */
    onchange?: (value: string | undefined) => void;
  };
  type Multiple = Common & {
    multiple: true;
    /** The pressed options' values (bindable), in option order. */
    value?: string[];
    allowNone?: undefined;
    onchange?: (value: string[]) => void;
  };

  let {
    options,
    label,
    size = 'small',
    theme,
    multiple = false,
    value = $bindable(),
    allowNone = false,
    id = nextId('ilw-toggle-group'),
    class: className = '',
    onchange,
    ...rest
  }: Single | Multiple = $props();

  const labelId = $derived(`${id}-label`);

  function pressed(option: ToggleOption): boolean {
    return multiple ? ((value as string[] | undefined) ?? []).includes(option.value) : value === option.value;
  }

  function toggle(option: ToggleOption) {
    if (multiple) {
      const on = new Set((value as string[] | undefined) ?? []);
      if (on.has(option.value)) on.delete(option.value);
      else on.add(option.value);
      const next = options.filter((o) => on.has(o.value)).map((o) => o.value);
      value = next;
      (onchange as Multiple['onchange'])?.(next);
    } else {
      const next = value === option.value ? (allowNone ? undefined : value) : option.value;
      if (next === value) return;
      value = next;
      (onchange as Single['onchange'])?.(next);
    }
  }
</script>

<div
  {...rest}
  class={['ilw-toggle-group', className]}
  {id}
  role="group"
  aria-labelledby={label ? labelId : rest['aria-labelledby']}
>
  {#if label}
    <span class="ilw-toggle-group-label" id={labelId}>{#if typeof label === 'string'}{label}{:else}{@render label()}{/if}</span>
  {/if}
  {#each options as option (option.value)}
    <button
      type="button"
      class={['ilw-button', size !== 'medium' && `ilw-button-${size}`, theme && `ilw-theme-${theme}`]}
      aria-pressed={pressed(option) ? 'true' : 'false'}
      data-value={option.value}
      disabled={option.disabled}
      onclick={() => toggle(option)}>{option.label}</button
    >
  {/each}
</div>
