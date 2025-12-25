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

	const { data, title = "View Trend", color = "#00D372" }: Props = $props();

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
						label: "訪問数",
						data: filledData.map((d) => d.count),
						borderColor: color,
						backgroundColor: `${color}20`,
						fill: true,
						tension: 0.3,
						borderWidth: 2,
						pointRadius: 3,
						pointHoverRadius: 5,
						pointBackgroundColor: color,
						pointBorderColor: "#ffffff",
						pointBorderWidth: 2,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				interaction: {
					intersect: false,
					mode: "index",
				},
				plugins: {
					title: {
						display: false,
					},
					legend: {
						display: false,
					},
					tooltip: {
						backgroundColor: "rgba(0, 0, 0, 0.8)",
						titleColor: "#ffffff",
						bodyColor: "#ffffff",
						padding: 12,
						borderColor: color,
						borderWidth: 1,
						displayColors: false,
						callbacks: {
							label: (context) => `${context.parsed.y}回`,
						},
					},
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							precision: 0,
							color: "#71717a",
							font: {
								family: "DM Sans",
								size: 12,
							},
						},
						grid: {
							color: "rgba(0, 0, 0, 0.05)",
						},
						border: {
							display: false,
						},
					},
					x: {
						ticks: {
							color: "#71717a",
							font: {
								family: "DM Sans",
								size: 12,
							},
							maxRotation: 0,
							autoSkip: true,
							autoSkipPadding: 20,
						},
						grid: {
							display: false,
						},
						border: {
							display: false,
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
