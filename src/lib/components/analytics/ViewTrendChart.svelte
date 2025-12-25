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
		data: Array<{ date: string; count: number }>;
		title?: string;
		color?: string;
	}

	const { data, title = "View Trend", color = "#570df8" }: Props = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;

	onMount(() => {
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Fill missing dates
		const allDates: string[] = [];
		const dateMap = new Map(data.map((d) => [d.date, d.count]));

		if (data.length > 0) {
			const firstItem = data[0];
			const lastItem = data[data.length - 1];
			if (firstItem && lastItem) {
				const startDate = new Date(firstItem.date);
				const endDate = new Date(lastItem.date);

				for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
					const dateStr = d.toISOString().split("T")[0];
					if (dateStr) {
						allDates.push(dateStr);
					}
				}
			}
		}

		const filledData = allDates.map((date) => ({
			date,
			count: dateMap.get(date) ?? 0,
		}));

		chart = new Chart(ctx, {
			type: "line",
			data: {
				labels: filledData.map((d) => new Date(d.date).toLocaleDateString("ja-JP")),
				datasets: [
					{
						label: "Views",
						data: filledData.map((d) => d.count),
						borderColor: color,
						backgroundColor: `${color}33`,
						fill: true,
						tension: 0.4,
					},
				],
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
						display: false,
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

<div class="h-64 w-full">
	<canvas bind:this={canvas}></canvas>
</div>
