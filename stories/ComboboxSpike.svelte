<script lang="ts">
  // Step 1 spike (docs/plans/2026-10-16-combobox.md): a bare Zag combobox with
  // our ids, no positioner and no trigger. Deleted once Combobox exists.
  import * as combobox from '@zag-js/combobox';
  import { normalizeProps, useMachine } from '@zag-js/svelte';

  const data = [
    { value: 'avery', label: 'Avery Adams' },
    { value: 'has space', label: 'Blake Brown' },
    { value: 'x:y', label: 'Casey Clark' },
    { value: 'drew', label: 'Drew Davis' },
  ];

  let items = $state.raw(data);
  let committed = $state('');
  const collection = $derived(combobox.collection({ items, itemToValue: (i) => i.value, itemToString: (i) => i.label }));

  const service = useMachine(combobox.machine, {
    id: 'spike',
    ids: {
      input: 'spike-cb',
      content: 'spike-popup',
      item: (value: string) => `spike-opt-${value}`,
    },
    get collection() {
      return collection;
    },
    allowCustomValue: true,
    // openOnChange's guard sees the text before the keystroke (1.44.0), so
    // open from onInputValueChange instead.
    openOnChange: false,
    onOpenChange() {
      items = data;
    },
    onInputValueChange({ inputValue, reason }) {
      const q = inputValue.toLowerCase();
      items = data.filter((i) => i.label.toLowerCase().includes(q) || i.value.includes(q));
      if (reason === 'input-change') api.setOpen(inputValue.length >= 2);
    },
    onValueChange({ value }: { value: string[] }) {
      committed = value[0] ?? '';
    },
  });
  const api = $derived(combobox.connect(service, normalizeProps));
</script>

<label id="spike-label" for="spike-cb">Person</label>
<span class="combobox" {...api.getRootProps()}>
  <input class="combobox-input" {...api.getInputProps()} />
  <div class="combobox-popup" {...api.getContentProps()}>
    {#each items as item (item.value)}
      <div {...api.getItemProps({ item })}>{item.label}</div>
    {/each}
  </div>
</span>
<output data-testid="committed">{committed}</output>
<output data-testid="state">{String(service.state.get())}</output>
