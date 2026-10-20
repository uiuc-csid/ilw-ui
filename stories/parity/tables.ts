// Every table variant the toolkit styles. `id` is the story arg value:
// Storybook's URL args allow only letters, digits, spaces, '-' and '_'.
export type TableVariant = { id: string; label: string; cls?: string; wrap?: 'responsive' | 'format'; rowHeaders?: boolean };

export const TABLE_VARIANTS: TableVariant[] = [
  { id: 'plain', label: 'table.ilw-table', cls: 'ilw-table' },
  { id: 'format', label: 'A bare table inside .ilw-format', wrap: 'format' },
  { id: 'stripe', label: '.ilw-table-stripe', cls: 'ilw-table ilw-table-stripe' },
  { id: 'row-headers', label: 'Row headers (tbody th)', cls: 'ilw-table', rowHeaders: true },
  { id: 'responsive', label: '.ilw-table-responsive', cls: 'ilw-table', wrap: 'responsive' },
  ...['blue', 'gray', 'orange', 'blue-light', 'orange-white-background'].map((t) => ({
    id: t,
    label: `.ilw-theme-table-${t}`,
    cls: `ilw-table ilw-table-stripe ilw-theme-table-${t}`,
  })),
];

export const TABLE_VARIANT_IDS = ['all', ...TABLE_VARIANTS.map((v) => v.id)];
