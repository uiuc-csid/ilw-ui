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

## Results log

| Date | Tester | AT + browser (versions) | Component(s) | Result / notes |
| ---- | ------ | ----------------------- | ------------ | -------------- |
