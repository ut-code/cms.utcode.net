export function onSaveShortcut(callback: () => void) {
  return (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      callback();
    }
  };
}
