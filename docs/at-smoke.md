# Assistive-technology smoke test

Automated tests cover DOM contracts, keyboard and axe. They can't tell whether a
screen reader *announces* things sensibly, so a person runs this checklist with
**NVDA + Firefox** (Windows) and **VoiceOver + Safari** (macOS) before a release,
and after any change to a component's markup.

Run it against `pnpm storybook` (open each story in its own tab via "Open canvas
in new tab"), then add a row to the log below.

## SortableTh (story: SortableTh → Table)

- [ ] Tabbing to a heading announces it as a button named for the column (e.g. "Name, button"), without the arrow.
- [ ] In table navigation (NVDA: Ctrl+Alt+arrows; VoiceOver: VO+arrows), the sorted column announces "sorted ascending" / "sorted descending"; unsorted columns announce no sort state.
- [ ] Pressing Enter or Space re-sorts; the new sort state is announced or discoverable by re-reading the header, and focus stays on the same button.

## Modal (stories: Modal → Trigger, Custom buttons, Rich body)

- [ ] Opening announces a dialog with its title ("Delete assignment?, dialog").
- [ ] The body text is read (on open or by reading forward).
- [ ] Focus starts on the autofocus button (Cancel) and it is announced.
- [ ] Tab and Shift+Tab cycle only through the modal's buttons and the close (×) button, which is announced as "Close modal, button".
- [ ] The virtual/browse cursor can't reach the page behind the modal (it is `inert`).
- [ ] Escape closes it; focus returns to the trigger and is announced.

## Combobox (stories: Combobox → Fixture, Fixture preselected, Many, Free text)

- [ ] Tabbing in announces "Person, combobox" (or "edit text, has autocomplete") with its current value, and that it is collapsed.
- [ ] Typing two characters announces that the list expanded. The number of results is announced or easy to find.
- [ ] ArrowDown and ArrowUp announce each option's name. On macOS, VoiceOver reads it once, not twice (Zag adds its own live region there; the component moves it into itself, so check it is still heard, including inside a Modal).
- [ ] Options in a group announce the group ("Faculty") when entering it.
- [ ] Enter announces the chosen value, the list collapses, and the input reads back the label.
- [ ] Escape collapses the list and focus stays in the input (not on the page).
- [ ] In Many, the "…N more — keep typing to narrow" row is announced as unavailable or dimmed and can't be chosen. Decide whether a disabled option reads well or whether a status message would be better (open question 1 in the Combobox plan).
- [ ] In Free text, unmatched text is read back as typed after Tab, and "No matches" is announced while the list is open.
- [ ] Disabled and invalid stories announce "dimmed/unavailable" and "invalid entry" respectively.

## Autocomplete (stories: Autocomplete → Fixture, Fixture empty text, Prefilled)

Status: **pending human run.**

- [ ] Tabbing in announces "Professor, combobox" (or "edit text, has autocomplete") with its current text, and that it is collapsed.
- [ ] Typing one character announces that the list expanded; the number of suggestions is announced or easy to find.
- [ ] ArrowDown and ArrowUp announce each suggestion's full text. On macOS, VoiceOver reads it once, not twice (the component moves Zag's live region into itself; it must still be heard).
- [ ] Enter writes the suggestion's short text (e.g. "D. Adams"); the list collapses and the input reads back the new text.
- [ ] Escape collapses the list; focus and the typed text stay.
- [ ] Tab with a suggestion highlighted writes it and moves to the next field; with none highlighted, the typed text is kept as is.
- [ ] In Fixture empty text, "No matches" is announced as unavailable or dimmed and can't be chosen.
- [ ] Prefilled: the existing text is read on focus, and ArrowDown lists only the suggestions matching it.

## DataTable and Pager (stories: DataTable → Fixture, Fixture paged)

- [ ] Table navigation reads the table's name ("People") and its column headers; the sorted heading announces its sort state.
- [ ] Enter or Space on a heading re-sorts, and focus stays on that heading's button.
- [ ] Each pager is announced as a navigation landmark with its own name ("Pages, top" / "Pages, bottom").
- [ ] The previous and next buttons are announced as "Previous page" and "Next page", and announced as dimmed or unavailable when disabled.
- [ ] The current page's button is announced as the current page.
- [ ] After pressing Next, focus stays on Next. On the last page, focus moves to the current page's button, and that is announced.

## announce (story: announce → Buttons)

Status: **pending human run.**

- [ ] "Announce politely" is read ("3 results") after the button's own name, without cutting it off.
- [ ] "Announce assertively" interrupts and reads "Could not save"; VoiceOver may prefix it with "alert".
- [ ] Pressing the same button twice reads the message twice, not once.
- [ ] Focus stays on the button. Nothing new appears on screen; reading to the end of the page with the browse/virtual cursor reaches the last message (the regions sit at the end of `<body>`).

## Page chrome (story: Page Chrome → Page → Fixture)

Status: **pending human run.**

- [ ] The first Tab reaches "Skip to main content, link", and it appears on screen. Enter moves to the content: the next Tab reaches the breadcrumbs' "Home", not the header.
- [ ] The landmarks list (NVDA: D / Insert+F7; VoiceOver rotor) has one banner, one main, one content info, and the "Breadcrumbs" and "Social media" navigations.
- [ ] Breadcrumbs: the list is announced with its item count; the separators (`>`) are not read; the last item is announced as the current page and is not a link.
- [ ] Page title: the heading is read as heading level 1; the background image is not announced.
- [ ] Footer: the wordmark link reads "University of Illinois Urbana-Champaign, link" once, not twice (no extra "Illinois" image); the campus sections are level-3 headings under it; the legal links are a list.

## Results log

| Date | Tester | AT + browser (versions) | Component(s) | Result / notes |
| ---- | ------ | ----------------------- | ------------ | -------------- |
