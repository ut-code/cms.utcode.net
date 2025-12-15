import { getContext, setContext } from "svelte";

interface Toast {
  id: string;
  message: string;
  type: "error" | "success" | "info";
}

export interface ToastControls {
  toasts: Toast[];
  show: (message: string, type?: Toast["type"]) => void;
  remove: (id: string) => void;
}

const TOAST_KEY = Symbol("toast");

export function setupToast(): ToastControls {
  let toasts = $state<Toast[]>([]);

  function show(message: string, type: Toast["type"] = "error") {
    const id = crypto.randomUUID();
    toasts = [...toasts, { id, message, type }];
    setTimeout(() => remove(id), 5000);
  }

  function remove(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
  }

  const controls: ToastControls = {
    get toasts() {
      return toasts;
    },
    show,
    remove,
  };

  setContext(TOAST_KEY, controls);
  return controls;
}

export function useToast(): ToastControls {
  return getContext<ToastControls>(TOAST_KEY);
}
