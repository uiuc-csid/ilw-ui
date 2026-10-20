<script module lang="ts">
  /** The toolkit's button themes; none is the blue outline button. */
  export type ButtonTheme =
    | 'blue'
    | 'blue-outline'
    | 'blue-1'
    | 'blue-solid'
    | 'orange'
    | 'orange-outline'
    | 'orange-1'
    | 'orange-solid';
  export type ButtonSize = 'small' | 'medium' | 'large';
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ClassValue, HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

  type Common = {
    size?: ButtonSize;
    theme?: ButtonTheme;
    /** A button gets `disabled`; a link loses its href and gets `aria-disabled="true"`. */
    disabled?: boolean;
    class?: ClassValue;
    children: Snippet;
  };
  type LinkProps = Common & { href: string } & Omit<HTMLAnchorAttributes, keyof Common | 'href'>;
  type ButtonProps = Common & { href?: undefined } & Omit<HTMLButtonAttributes, keyof Common>;

  let {
    size = 'medium',
    theme,
    disabled = false,
    class: cls,
    href,
    children,
    ...rest
  }: LinkProps | ButtonProps = $props();

  const classes = $derived([
    'ilw-button',
    size !== 'medium' && `ilw-button-${size}`,
    theme && `ilw-theme-${theme}`,
    cls,
  ]);
</script>

{#if href === undefined}
  <button type="button" {...rest as HTMLButtonAttributes} class={classes} {disabled}>{@render children()}</button>
{:else if disabled}
  <!-- No href, so it leaves the Tab order; role keeps it announced as a link. -->
  <a {...rest as HTMLAnchorAttributes} class={classes} role="link" aria-disabled="true" tabindex={undefined} onclick={undefined}
    >{@render children()}</a
  >
{:else}
  <a {...rest as HTMLAnchorAttributes} class={classes} {href}>{@render children()}</a>
{/if}
