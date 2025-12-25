<script lang="ts">
	import { onMount } from "svelte";
	import {
		Chart,
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		CategoryScale,
		Title,
		Tooltip,
		Legend,
		Filler,
	} from "chart.js";

	Chart.register(
		LineController,
		LineElement,
		PointElement,
		LinearScale,
		CategoryScale,
		Title,
		Tooltip,
		Legend,
		Filler,
	);

	interface Props {
		data: Array<{ date: string; resourceType: string; count: number }>;
		title?: string;
	}

	const { data, title = "Views by Content Type" }: Props = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	const COLORS = {
		article: "#f28b82",
		project: "#81c995",
		member: "#78d9ec",
	};

	onMount(() => {
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Group by type
		const byType = new Map<string, Map<string, number>>();
		const allDates = new Set<string>();

		for (const item of data) {
			allDates.add(item.date);
			if (!byType.has(item.resourceType)) {
				byType.set(item.resourceType, new Map());
			}
			byType.get(item.resourceType)?.set(item.date, item.count);
		}

		const sortedDates = Array.from(allDates).sort();

		// Fill missing dates for each type
		const datasets = Array.from(byType.entries()).map(([type, dateMap]) => {
			const filledData = sortedDates.map((date) => dateMap.get(date) ?? 0);
			return {
				label: type.charAt(0).toUpperCase() + type.slice(1) + "s",
				data: filledData,
				borderColor: COLORS[type as keyof typeof COLORS] ?? "#570df8",
				backgroundColor: `${COLORS[type as keyof typeof COLORS] ?? "#570df8"}33`,
				fill: true,
				tension: 0.4,
			};
		});

		chart = new Chart(ctx, {
			type: "line",
			data: {
				labels: sortedDates.map((d) => new Date(d).toLocaleDateString("ja-JP")),
				datasets,
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					title: {
						display: true,
						text: title,
					},
					legend: {
						display: true,
						position: "top",
					},
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							precision: 0,
						},
					},
				},
			},
		});

		return () => {
			chart?.destroy();
		};
	});
</script>

<div class="h-80 w-full">
	<canvas bind:this={canvas}></canvas>
</div>
