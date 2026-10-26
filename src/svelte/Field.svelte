<!--
  A form field (A7), rendering the markup documented in the README: the label,
  the control (the `children` snippet, which spreads `attrs` on it), help text
  and an error, wired together with `for`, `aria-describedby` and
  `aria-invalid`. Styled by forms.css (and switch.css for a switch).
-->
<script module lang="ts">
  /** What `Field` hands its control: spread it on the input, select or textarea. */
  export interface FieldAttrs {
    id: string;
    required: true | undefined;
    'aria-describedby': string | undefined;
    'aria-invalid': 'true' | undefined;
  }
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  import { nextId } from '../core/index.ts';

  let {
    label,
    description,
    error,
    required = false,
    compact = false,
    variant = 'entry',
    id = nextId('ilw-field'),
    descriptionId = `${id}-description`,
    errorId = `${id}-error`,
    class: className = '',
    children,
  }: {
    /** The label's content. */
    label: string | Snippet;
    /** Help text under the control, read as part of its description. */
    description?: string | Snippet;
    /** The error message. Set means invalid: the control gets `aria-invalid="true"`. */
    error?: string | Snippet;
    /** Adds `required` to the control and the "*" marker to the label. */
    required?: boolean;
    /** The compact layout: the label in a column beside the control. */
    compact?: boolean;
    /** `'checkbox'` for a checkbox or switch: the box beside its label. */
    variant?: 'entry' | 'checkbox';
    /** The control's id; the label's `for`. */
    id?: string;
    descriptionId?: string;
    errorId?: string;
    /** More classes on the outer element. */
    class?: string;
    /** The control. Spread `attrs` on it. */
    children: Snippet<[FieldAttrs]>;
  } = $props();

  const describedby = $derived([description && descriptionId, error && errorId].filter(Boolean).join(' ') || undefined);
  const attrs = $derived<FieldAttrs>({
    id,
    required: required || undefined,
    'aria-describedby': describedby,
    'aria-invalid': error ? 'true' : undefined,
  });
  const entry = $derived(`ilw-input-entry${variant === 'checkbox' ? '-checkbox' : ''}${compact ? '-compact' : ''}`);
</script>

<div class={[entry, className]}>
  <label for={id} class={{ 'ilw-label-required': required }}>{#if typeof label === 'string'}{label}{:else}{@render label()}{/if}</label>
  {@render children(attrs)}
  {#if description}
    <p class="ilw-input-description" id={descriptionId}>{#if typeof description === 'string'}{description}{:else}{@render description()}{/if}</p>
  {/if}
  {#if error}
    <p class="ilw-input-alert" id={errorId}>{#if typeof error === 'string'}{error}{:else}{@render error()}{/if}</p>
  {/if}
</div>
