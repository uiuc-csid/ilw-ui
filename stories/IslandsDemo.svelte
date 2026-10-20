<script lang="ts">
  // Stands in for a server-rendered page: island hosts and a Django json_script
  // block, with nothing mounted. The stories' play functions call mountIslands.
  const json = JSON.stringify({ label: 'From json_script', start: 5 });
  const attachScript = (el: HTMLElement) => {
    const script = document.createElement('script');
    script.type = 'application/json';
    script.id = 'island-props';
    script.textContent = json;
    el.append(script);
    return () => script.remove();
  };
</script>

<div id="islands" {@attach attachScript}>
  <div data-ilw-island="counter" data-props={'{"label":"Inline props","start":2}'}></div>
  <div data-ilw-island="counter" data-props-id="island-props"></div>
  <div data-ilw-island="counter" data-props={'{"label": oops}'}></div>
  <div data-ilw-island="missing"></div>
</div>
