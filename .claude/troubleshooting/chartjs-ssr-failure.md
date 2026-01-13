# Chart.js SSR Failure

**Keywords**: chart.js, blank page, nothing renders, empty page, white screen

**Symptom**: Page using Chart.js renders blank/nothing.

**Cause**: Chart.js requires browser APIs (`window`, `canvas`, etc.) and fails when imported at module level during SSR.

**Solution**: Dynamically import Chart.js inside `onMount`:

```svelte
<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import type { Chart as ChartType } from "chart.js";

  let chart: ChartType | null = null;

  onDestroy(() => chart?.destroy());

  onMount(async () => {
    const { Chart, LineController, ... } = await import("chart.js");
    Chart.register(LineController, ...);
    // create chart
  });
</script>
```
