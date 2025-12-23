<script lang="ts">
	import { untrack } from "svelte";
	import {
		AlertTriangle,
		CheckCircle,
		DatabaseBackup,
		ImageOff,
		Play,
		RotateCcw,
		Trash2,
		XCircle,
	} from "lucide-svelte";
	import { cleanup, deleteAll, getStatus, reset, start } from "$lib/data/private/migration.remote";
	import type { MigrationState } from "$lib/shared/types/migration";

	let migrationState: MigrationState | null = $state(null);
	let pollInterval: ReturnType<typeof setInterval> | null = $state(null);
	let logsContainer: HTMLPreElement | null = $state(null);
	let isStarting = $state(false);

	const isRunning = $derived.by(() => migrationState?.status === "running");
	const isDisabled = $derived.by(() => isStarting || isRunning);

	async function fetchStatus() {
		// Check if user is at bottom before fetch
		const wasAtBottom = logsContainer
			? logsContainer.scrollHeight - logsContainer.scrollTop <= logsContainer.clientHeight + 10
			: true;

		migrationState = await getStatus();

		// Only auto-scroll if user was already at bottom
		if (logsContainer && wasAtBottom) {
			logsContainer.scrollTop = logsContainer.scrollHeight;
		}
	}

	async function handleStart() {
		if (isDisabled) return;
		isStarting = true;
		try {
			const result = await start();
			if (result.started) {
				await fetchStatus();
			}
		} finally {
			isStarting = false;
		}
	}

	async function handleReset() {
		await reset();
		migrationState = await getStatus();
	}

	async function handleCleanup() {
		if (isDisabled) return;
		isStarting = true;
		try {
			const result = await cleanup();
			if (result.started) {
				await fetchStatus();
			}
		} finally {
			isStarting = false;
		}
	}

	async function handleDeleteAll() {
		if (isDisabled) return;
		if (!confirm("Are you sure you want to delete ALL members, articles, and projects?")) return;
		isStarting = true;
		try {
			const result = await deleteAll();
			if (result.started) {
				await fetchStatus();
			}
		} finally {
			isStarting = false;
		}
	}

	// Poll every 1s to keep status in sync, cleanup on unmount
	// Use untrack to prevent infinite loop from migrationState changes
	$effect(() => {
		// Initial fetch - wrapped in untrack to prevent reactive dependencies
		untrack(() => {
			fetchStatus().catch(console.error);
		});

		// Start polling
		pollInterval = setInterval(fetchStatus, 1000);
		return () => {
			if (pollInterval) clearInterval(pollInterval);
		};
	});
</script>

<svelte:head>
	<title>Data Migration - ut.code(); CMS</title>
</svelte:head>

<div class="space-y-4 sm:space-y-6">
	<!-- Header -->
	<header
		class="animate-fade-slide-in relative overflow-hidden rounded-2xl border border-warning/30 bg-gradient-to-br from-warning/20 to-error/20 p-4 sm:p-6"
	>
		<!-- Warning decorative elements -->
		<div class="absolute top-0 -right-10 h-32 w-32 rounded-full bg-warning/30 blur-3xl"></div>
		<div class="absolute bottom-0 -left-10 h-24 w-24 rounded-full bg-error/20 blur-2xl"></div>

		<div class="relative flex items-center justify-between">
			<div class="flex items-center gap-3 sm:gap-4">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/30 sm:h-12 sm:w-12">
					<DatabaseBackup class="h-5 w-5 text-warning sm:h-6 sm:w-6" />
				</div>
				<div>
					<h1 class="text-lg font-bold text-base-content sm:text-2xl">Legacy Data Migration</h1>
					<p class="text-xs text-base-content/60 sm:text-sm">Import data from old utcode.net repository</p>
				</div>
			</div>
		</div>
	</header>

	<!-- Warning banner -->
	<div class="alert alert-warning">
		<AlertTriangle class="h-5 w-5" />
		<div>
			<p class="font-semibold">This is a heavy operation</p>
			<p class="text-sm opacity-80">
				This will clone the old ut-code/utcode.net repository and import members, articles, and
				projects. Existing entries will be skipped. This operation may take several minutes.
			</p>
		</div>
	</div>

	<!-- Status card -->
	<div class="card border border-base-300 bg-base-100">
		<div class="card-body">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="card-title">Migration Status</h2>
				<div class="flex items-center gap-2">
					{#if migrationState?.status === "idle"}
						<span class="badge badge-ghost">Idle</span>
					{:else if migrationState?.status === "running"}
						<span class="badge gap-1 badge-warning">
							<span class="loading loading-xs loading-spinner"></span>
							Running
						</span>
					{:else if migrationState?.status === "completed"}
						<span class="badge gap-1 badge-success">
							<CheckCircle class="h-3 w-3" />
							Completed
						</span>
					{:else if migrationState?.status === "error"}
						<span class="badge gap-1 badge-error">
							<XCircle class="h-3 w-3" />
							Failed
						</span>
					{/if}
				</div>
			</div>

			<!-- Action buttons -->
			<div class="mb-4 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
				<button class="btn btn-sm gap-2 btn-warning sm:btn-md" onclick={handleStart} disabled={isDisabled}>
					{#if isStarting}
						<span class="loading loading-spinner loading-xs"></span>
					{:else}
						<Play class="h-4 w-4" />
					{/if}
					Start Migration
				</button>
				<button class="btn btn-sm gap-2 btn-secondary sm:btn-md" onclick={handleCleanup} disabled={isDisabled}>
					{#if isStarting}
						<span class="loading loading-spinner loading-xs"></span>
					{:else}
						<ImageOff class="h-4 w-4" />
					{/if}
					Cleanup Invalid URLs
				</button>
				<button class="btn btn-sm gap-2 btn-error sm:btn-md" onclick={handleDeleteAll} disabled={isDisabled}>
					{#if isStarting}
						<span class="loading loading-spinner loading-xs"></span>
					{:else}
						<Trash2 class="h-4 w-4" />
					{/if}
					Delete All Data
				</button>
				{#if migrationState?.status === "completed" || migrationState?.status === "error"}
					<button class="btn btn-sm gap-2 btn-ghost sm:btn-md" onclick={handleReset}>
						<RotateCcw class="h-4 w-4" />
						Reset
					</button>
				{/if}
			</div>

			<!-- Results summary -->
			{#if migrationState?.result}
				<div class="mb-4 grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
					<div class="stat rounded-lg bg-base-200 p-3 sm:p-4">
						<div class="stat-title text-xs sm:text-sm">Members</div>
						<div class="stat-value text-base text-success sm:text-lg">
							{migrationState.result.members.created}
						</div>
						<div class="stat-desc text-xs">
							{migrationState.result.members.skipped} skipped, {migrationState.result.members
								.errors} errors
						</div>
					</div>
					<div class="stat rounded-lg bg-base-200 p-3 sm:p-4">
						<div class="stat-title text-xs sm:text-sm">Articles</div>
						<div class="stat-value text-base text-success sm:text-lg">
							{migrationState.result.articles.created}
						</div>
						<div class="stat-desc text-xs">
							{migrationState.result.articles.skipped} skipped, {migrationState.result.articles
								.errors} errors
						</div>
					</div>
					<div class="stat rounded-lg bg-base-200 p-3 sm:p-4">
						<div class="stat-title text-xs sm:text-sm">Projects</div>
						<div class="stat-value text-base text-success sm:text-lg">
							{migrationState.result.projects.created}
						</div>
						<div class="stat-desc text-xs">
							{migrationState.result.projects.skipped} skipped, {migrationState.result.projects
								.errors} errors
						</div>
					</div>
					<div class="stat rounded-lg bg-base-200 p-3 sm:p-4">
						<div class="stat-title text-xs sm:text-sm">Images</div>
						<div class="stat-value text-base text-success sm:text-lg">
							{migrationState.result.images.created}
						</div>
						<div class="stat-desc text-xs">
							{migrationState.result.images.skipped} skipped, {migrationState.result.images
								.errors} errors
						</div>
					</div>
				</div>
			{/if}

			<!-- Error display -->
			{#if migrationState?.error}
				<div class="mb-4 alert alert-error">
					<XCircle class="h-5 w-5" />
					<span>{migrationState.error}</span>
				</div>
			{/if}

			<!-- Logs -->
			<div class="form-control">
				<label class="label" for="logs">
					<span class="label-text font-medium">Logs</span>
					{#if migrationState?.logs.length}
						<span class="label-text-alt">{migrationState.logs.length} lines</span>
					{/if}
				</label>
				<pre
					id="logs"
					bind:this={logsContainer}
					class="h-80 overflow-auto rounded-lg bg-base-300 p-4 font-mono text-xs whitespace-pre-wrap">{#if migrationState?.logs.length}{migrationState.logs.join(
							"\n",
						)}{:else}No logs yet. Click "Start Migration" to begin.{/if}</pre>
			</div>

			<!-- Timestamps -->
			{#if migrationState?.startedAt || migrationState?.completedAt}
				<div class="mt-4 flex flex-col gap-1 text-xs text-base-content/60 sm:flex-row sm:gap-4 sm:text-sm">
					{#if migrationState?.startedAt}
						<span>Started: {new Date(migrationState.startedAt).toLocaleString("ja-JP")}</span>
					{/if}
					{#if migrationState?.completedAt}
						<span>Completed: {new Date(migrationState.completedAt).toLocaleString("ja-JP")}</span>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
