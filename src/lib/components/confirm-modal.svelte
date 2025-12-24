<script lang="ts" module>
	export type ConfirmOptions = {
		title: string;
		description?: string;
		confirmText?: string;
		cancelText?: string;
		variant?: "default" | "danger" | "warning";
	};

	type ModalState = {
		options: ConfirmOptions | null;
		resolver: ((value: boolean) => void) | null;
	};

	let modalState = $state<ModalState>({ options: null, resolver: null });

	export function confirm(options: ConfirmOptions): Promise<boolean> {
		return new Promise((resolve) => {
			modalState.options = options;
			modalState.resolver = resolve;
		});
	}

	function close(result: boolean) {
		modalState.resolver?.(result);
		modalState.options = null;
		modalState.resolver = null;
	}
</script>

<script lang="ts">
	import { AlertTriangle, Info, Trash2 } from "lucide-svelte";
	import { tick } from "svelte";

	const variantStyles = {
		default: {
			icon: "bg-zinc-100 text-zinc-600",
			button: "bg-zinc-900 hover:bg-zinc-800 text-white",
		},
		danger: {
			icon: "bg-red-50 text-red-500",
			button: "bg-red-600 hover:bg-red-700 text-white",
		},
		warning: {
			icon: "bg-amber-50 text-amber-500",
			button: "bg-amber-600 hover:bg-amber-700 text-white",
		},
	};

	let cancelButtonRef = $state<HTMLButtonElement | null>(null);
	let confirmButtonRef = $state<HTMLButtonElement | null>(null);

	$effect(() => {
		if (modalState.options && cancelButtonRef) {
			tick().then(() => {
				cancelButtonRef?.focus();
			}).catch(console.error);
		}
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") close(false);
	}

	function handleModalKeydown(e: KeyboardEvent) {
		if (e.key !== "Tab") return;

		const focusableElements = [cancelButtonRef, confirmButtonRef].filter(
			(el): el is HTMLButtonElement => el !== null,
		);

		if (focusableElements.length === 0) return;

		const currentIndex = focusableElements.indexOf(
			document.activeElement as HTMLButtonElement,
		);

		e.preventDefault();

		if (e.shiftKey) {
			// Shift+Tab: 前の要素へ
			const prevIndex =
				currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
			const prevElement = focusableElements[prevIndex];
			if (prevElement) prevElement.focus();
		} else {
			// Tab: 次の要素へ
			const nextIndex = (currentIndex + 1) % focusableElements.length;
			const nextElement = focusableElements[nextIndex];
			if (nextElement) nextElement.focus();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if modalState.options}
	{@const opts = modalState.options}
	{@const variant = opts.variant ?? "default"}
	{@const styles = variantStyles[variant]}

	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 p-4 backdrop-blur-sm"
		onclick={() => close(false)}
		onkeydown={(e) => e.key === "Enter" && close(false)}
		role="button"
		tabindex="-1"
	>
		<!-- Modal -->
		<div
			class="w-full max-w-sm rounded-2xl border border-zinc-100 bg-white p-6 shadow-2xl"
			style="animation: modalIn 0.15s ease-out"
			onclick={(e) => e.stopPropagation()}
			onkeydown={handleModalKeydown}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			tabindex="-1"
		>
			<!-- Icon -->
			<div class="mx-auto flex h-10 w-10 items-center justify-center rounded-full {styles.icon}">
				{#if variant === "danger"}
					<Trash2 class="h-5 w-5" />
				{:else if variant === "warning"}
					<AlertTriangle class="h-5 w-5" />
				{:else}
					<Info class="h-5 w-5" />
				{/if}
			</div>

			<!-- Title -->
			<h3 id="modal-title" class="mt-4 text-center text-base font-semibold text-zinc-900">
				{opts.title}
			</h3>

			<!-- Description -->
			{#if opts.description}
				<p class="mt-2 text-center text-sm text-zinc-500">
					{opts.description}
				</p>
			{/if}

			<!-- Actions -->
			<div class="mt-6 flex gap-3">
				<button
					bind:this={cancelButtonRef}
					type="button"
					onclick={() => close(false)}
					class="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all duration-150 hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98]"
				>
					{opts.cancelText ?? "Cancel"}
				</button>
				<button
					bind:this={confirmButtonRef}
					type="button"
					onclick={() => close(true)}
					class="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-150 active:scale-[0.98] {styles.button}"
				>
					{opts.confirmText ?? "Confirm"}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes modalIn {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
