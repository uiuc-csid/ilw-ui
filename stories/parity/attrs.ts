/**
 * An attachment that sets attributes. Svelte sets an upgraded custom element's
 * properties instead of its attributes, and toolkit.css selects on the
 * attributes (`ilw-content[mode=lede]`, `[theme=gray]`): `<ilw-content {@attach attrs({ mode: 'lede' })}>`.
 */
export function attrs(values: Record<string, string>) {
  return (el: Element) => {
    for (const [name, value] of Object.entries(values)) el.setAttribute(name, value);
  };
}
