// The theme classes the toolkit's button rules name ('none': no class, the
// blue outline button), shared by ButtonGrid.svelte and its React twin. -2 and
// -inverse aren't button themes upstream. Ids double as story args, which allow
// only letters, digits, '-' and '_'.
export const BUTTON_THEMES = ['none', 'blue', 'blue-outline', 'blue-1', 'blue-solid', 'orange', 'orange-outline', 'orange-1', 'orange-solid'];
export const BUTTON_VARIANTS = ['all', 'lists', ...BUTTON_THEMES];
