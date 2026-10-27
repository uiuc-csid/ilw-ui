// ilw-ui/react: the React 19 twins of ilw-ui/svelte's exports, under the same
// names (tests/unit/twins.test.ts compares the two lists). One group per row of
// docs/plans/2026-10-27-react-components.md, so ports running side by side each
// add lines under their own comment and don't touch each other's.

// R0d: the page shell
export { BackToTop } from './BackToTop.tsx';
export { Page } from './Page.tsx';

// R1 layout, Button, Icon, CopyButton: Button, ButtonSize, ButtonTheme, Icon, Columns, ColumnsMode, Content,
// Grid, Spacer, LayoutTheme, LayoutWidth, CopyButton

// R1 page chrome: Breadcrumbs, Crumb, PageTitle, SectionNav, SectionNavItem, Footer, Pagination, SortableTh

// R2 forms: Field, FieldAttrs, RadioGroup, RadioOption, ChoiceChips, ChipOption

// R3 islands and header: mountIslands, IslandRegistry, DarkModeToggle, Header, HeaderLink, HeaderNavItem,
// HeaderSearch

// R4 modal: Modal, openModal, alert, confirm, CloseReason, ModalButton, ModalOptions, ModalSize

// R5 data: useDataTable (createDataTable), DataTable, DataRows, TableSortTh, Pager, isPaged, setTableFilter,
// ilwPagerClasses, legacyPagerClasses, AnyDataTable, DataTableInstance, DataTableOptions,
// PagedDataTableInstance, PagerClasses

// R6 Zag: AsyncSource, Combobox, Autocomplete, MultiCombobox

// R7 select enhancement: enhanceSelect, enhanceSelects

// R8 tabs: Tabs, TabItem, enhanceTabs, enhanceAllTabs

// R9 tooltip: Tooltip, TooltipArrow, TooltipAttrs

// R10 accordion: Accordion, AccordionPanel, AccordionAccent

// R11 alert: Alert, AlertVariant, dismissAlert, enhanceAlerts

// R12 toggle group: ToggleGroup, ToggleOption
