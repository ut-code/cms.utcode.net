<script lang="ts">
	import type { Icon } from "lucide-svelte";
	import { ArrowRight } from "lucide-svelte";
	import type { ComponentType } from "svelte";

	interface Props {
		label: string;
		value: number;
		sublabel: string;
		href: string;
		icon: ComponentType<Icon>;
		iconColor: "success" | "warning" | "info" | "error";
		accentColor: string;
		stagger: number;
	}

	const { label, value, sublabel, href, icon, iconColor, accentColor, stagger }: Props = $props();

	const iconColorClasses = {
		success: "bg-success/10 text-success group-hover:bg-success/20",
		warning: "bg-warning/10 text-warning group-hover:bg-warning/20",
		info: "bg-info/10 text-info group-hover:bg-info/20",
		error: "bg-error/10 text-error group-hover:bg-error/20",
	};
</script>

<a
	{href}
	class="group animate-fade-slide-in stagger-{stagger} card-hover glow-soft relative overflow-hidden rounded-2xl bg-base-100 p-5"
>
	<div class="stat-accent" style="--accent-color: {accentColor};"></div>
	<div class="flex items-center justify-between">
		<span class="text-sm font-medium text-base-content/60">{label}</span>
		<div
			class="flex h-10 w-10 items-center justify-center rounded-xl transition-all group-hover:scale-110 {iconColorClasses[
				iconColor
			]}"
		>
			<!-- svelte-ignore svelte_component_deprecated -->
			<svelte:component this={icon} class="h-5 w-5" />
		</div>
	</div>
	<p class="mt-3 font-mono text-4xl font-bold text-base-content">
		{value}
	</p>
	<div class="mt-1 flex items-center justify-between">
		<span class="text-xs text-base-content/40">{sublabel}</span>
		<ArrowRight
			class="h-4 w-4 text-base-content/20 transition-all group-hover:translate-x-1 group-hover:text-primary"
		/>
	</div>
</a>
