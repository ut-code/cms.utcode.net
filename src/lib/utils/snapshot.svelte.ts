import { untrack } from "svelte";

/** Creates an untracked snapshot of reactive data for initial state */
export function snapshot<T>(getData: () => T) {
  return untrack(() => $state.snapshot(getData()));
}
