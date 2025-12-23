<script lang="ts">
  import {
    DatabaseBackup,
    AlertTriangle,
    Play,
    RotateCcw,
    CheckCircle,
    XCircle,
  } from "lucide-svelte";
  import { start, getStatus, reset } from "$lib/data/private/migration.remote";
  import type { MigrationState } from "$lib/shared/types/migration";

  let migrationState: MigrationState | null = $state(null);
  let pollInterval: ReturnType<typeof setInterval> | null = $state(null);
  let logsContainer: HTMLPreElement | null = $state(null);

  async function fetchStatus() {
    migrationState = await getStatus();

    // Auto-scroll logs to bottom
    if (logsContainer) {
      logsContainer.scrollTop = logsContainer.scrollHeight;
    }

    // Stop polling when completed or errored
    if (migrationState.status !== "running" && pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
  }

  async function handleStart() {
    const result = await start();
    if (result.started) {
      await fetchStatus();
      // Start polling
      pollInterval = setInterval(fetchStatus, 500);
    }
  }

  async function handleReset() {
    await reset();
    migrationState = await getStatus();
  }

  // Initial fetch
  $effect(() => {
    fetchStatus().catch(console.error);
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  });
</script>

<svelte:head>
  <title>Data Migration - ut.code(); CMS</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <header class="animate-fade-slide-in relative overflow-hidden rounded-2xl bg-gradient-to-br from-warning/20 to-error/20 p-6 border border-warning/30">
    <!-- Warning decorative elements -->
    <div class="absolute top-0 -right-10 h-32 w-32 rounded-full bg-warning/30 blur-3xl"></div>
    <div class="absolute bottom-0 -left-10 h-24 w-24 rounded-full bg-error/20 blur-2xl"></div>

    <div class="relative flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/30">
          <DatabaseBackup class="h-6 w-6 text-warning" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-base-content">Legacy Data Migration</h1>
          <p class="text-sm text-base-content/60">Import data from old utcode.net repository</p>
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
        This will clone the old ut-code/utcode.net repository and import members, articles, and projects.
        Existing entries will be skipped. This operation may take several minutes.
      </p>
    </div>
  </div>

  <!-- Status card -->
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body">
      <div class="flex items-center justify-between mb-4">
        <h2 class="card-title">Migration Status</h2>
        <div class="flex items-center gap-2">
          {#if migrationState?.status === "idle"}
            <span class="badge badge-ghost">Idle</span>
          {:else if migrationState?.status === "running"}
            <span class="badge badge-warning gap-1">
              <span class="loading loading-spinner loading-xs"></span>
              Running
            </span>
          {:else if migrationState?.status === "completed"}
            <span class="badge badge-success gap-1">
              <CheckCircle class="h-3 w-3" />
              Completed
            </span>
          {:else if migrationState?.status === "error"}
            <span class="badge badge-error gap-1">
              <XCircle class="h-3 w-3" />
              Failed
            </span>
          {/if}
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex gap-2 mb-4">
        <button
          class="btn btn-warning gap-2"
          onclick={handleStart}
          disabled={migrationState?.status === "running"}
        >
          <Play class="h-4 w-4" />
          Start Migration
        </button>
        {#if migrationState?.status === "completed" || migrationState?.status === "error"}
          <button class="btn btn-ghost gap-2" onclick={handleReset}>
            <RotateCcw class="h-4 w-4" />
            Reset
          </button>
        {/if}
      </div>

      <!-- Results summary -->
      {#if migrationState?.result}
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div class="stat bg-base-200 rounded-lg p-4">
            <div class="stat-title">Members</div>
            <div class="stat-value text-lg text-success">{migrationState.result.members.created}</div>
            <div class="stat-desc">
              {migrationState.result.members.skipped} skipped, {migrationState.result.members.errors} errors
            </div>
          </div>
          <div class="stat bg-base-200 rounded-lg p-4">
            <div class="stat-title">Articles</div>
            <div class="stat-value text-lg text-success">{migrationState.result.articles.created}</div>
            <div class="stat-desc">
              {migrationState.result.articles.skipped} skipped, {migrationState.result.articles.errors} errors
            </div>
          </div>
          <div class="stat bg-base-200 rounded-lg p-4">
            <div class="stat-title">Projects</div>
            <div class="stat-value text-lg text-success">{migrationState.result.projects.created}</div>
            <div class="stat-desc">
              {migrationState.result.projects.skipped} skipped, {migrationState.result.projects.errors} errors
            </div>
          </div>
        </div>
      {/if}

      <!-- Error display -->
      {#if migrationState?.error}
        <div class="alert alert-error mb-4">
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
          class="bg-base-300 rounded-lg p-4 text-xs font-mono h-80 overflow-auto whitespace-pre-wrap"
        >{#if migrationState?.logs.length}{migrationState.logs.join("\n")}{:else}No logs yet. Click "Start Migration" to begin.{/if}</pre>
      </div>

      <!-- Timestamps -->
      {#if migrationState?.startedAt || migrationState?.completedAt}
        <div class="flex gap-4 text-sm text-base-content/60 mt-4">
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
