<!--
  A notice (E1), rendering the markup documented in the README: an icon, a
  visually hidden variant label, an optional title, the message, optional
  actions and an optional dismiss button. `role="alert"` for errors only,
  `role="status"` for the rest. Dismissing moves focus out of the alert
  (alert.ts), never to <body>. Styled by alert.css.
-->
<script module lang="ts">
  export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

  const LABELS: Record<AlertVariant, string> = {
    info: 'Information:',
    success: 'Success:',
    warning: 'Warning:',
    error: 'Error:',
  };
</script>

<script lang="ts">
  import CheckCircle from 'phosphor-svelte/lib/CheckCircle';
  import Info from 'phosphor-svelte/lib/Info';
  import Warning from 'phosphor-svelte/lib/Warning';
  import WarningOctagon from 'phosphor-svelte/lib/WarningOctagon';
  import X from 'phosphor-svelte/lib/X';
  import { type Snippet, tick } from 'svelte';

  import { focusLost, focusTargetAfter } from './alert.ts';
  import Icon from './Icon.svelte';

  const ICONS = { info: Info, success: CheckCircle, warning: Warning, error: WarningOctagon };

  let {
    variant = 'info',
    title,
    label,
    dismissible = false,
    dismissLabel = 'Dismiss',
    open = $bindable(true),
    ondismiss,
    id,
    class: className = '',
    children,
    actions,
  }: {
    /** `'error'` is `role="alert"`; the others are `role="status"`. */
    variant?: AlertVariant;
    /** A bold first line. */
    title?: string | Snippet;
    /** The visually hidden text that names the variant to screen readers. Defaults to "Error:", "Success:", … */
    label?: string;
    /** Adds the dismiss (×) button. */
    dismissible?: boolean;
    /** The dismiss button's accessible name. */
    dismissLabel?: string;
    /** False hides the alert; dismissing sets it false. */
    open?: boolean;
    /** Called on dismiss, before focus moves. Focus it moves itself stays where it put it. */
    ondismiss?: () => void;
    id?: string;
    /** More classes on the outer element. */
    class?: string;
    /** The message: one or more paragraphs. */
    children: Snippet;
    /** Buttons or links under the message (retry, log in again). */
    actions?: Snippet;
  } = $props();

  let root = $state<HTMLElement>();

  async function dismiss() {
    const target = focusTargetAfter(root!);
    const moveFocus = focusLost(root!);
    open = false;
    ondismiss?.();
    await tick();
    const active = document.activeElement;
    if (moveFocus && (!active || active === document.body)) target?.focus();
  }
</script>

{#if open}
  <div bind:this={root} {id} class={['ilw-alert', `ilw-alert--${variant}`, className]} role={variant === 'error' ? 'alert' : 'status'}>
    <Icon icon={ICONS[variant]} class="ilw-alert-icon" />
    <div class="ilw-alert-body">
      <span class="ilw-visually-hidden">{label ?? LABELS[variant]}</span>
      {#if title}
        <p class="ilw-alert-title">{#if typeof title === 'string'}{title}{:else}{@render title()}{/if}</p>
      {/if}
      {@render children()}
      {#if actions}
        <div class="ilw-alert-actions">{@render actions()}</div>
      {/if}
    </div>
    {#if dismissible}
      <button type="button" class="ilw-alert-dismiss" aria-label={dismissLabel} onclick={dismiss}>
        <Icon icon={X} type="line" />
      </button>
    {/if}
  </div>
{/if}
