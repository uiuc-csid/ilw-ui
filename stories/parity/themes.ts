// Every theme the toolkit defines outside tables (the -table-* themes come with
// the table styles). `id` is the story arg value: Storybook's URL args allow
// only letters, digits, spaces, '-' and '_'.
export type Theme = { id: string; label: string; cls?: string; attr?: string };

export const THEMES: Theme[] = [
  { id: 'default', label: 'No theme (page default)' },
  ...['blue', 'blue-outline', 'blue-1', 'blue-2', 'blue-solid', 'blue-inverse'].map((t) => ({ id: t, label: `.ilw-theme-${t}`, cls: `ilw-theme-${t}` })),
  ...['orange', 'orange-outline', 'orange-1', 'orange-2', 'orange-solid', 'orange-inverse'].map((t) => ({ id: t, label: `.ilw-theme-${t}`, cls: `ilw-theme-${t}` })),
  ...['white', 'blue', 'gray', 'blue-gradient', 'orange', 'orange-gradient'].map((t) => ({ id: `attr-${t}`, label: `[theme=${t}]`, attr: t })),
];

export const VARIANTS = ['all', ...THEMES.map((t) => t.id)];
