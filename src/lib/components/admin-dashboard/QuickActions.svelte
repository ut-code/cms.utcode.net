<script lang="ts">
  import { Zap, UserPlus, Pencil, Folder, DatabaseBackup, Loader2 } from "lucide-svelte";
  import { runMigration } from "$lib/data/private/migration.remote";

  let migrationState = $state<"idle" | "running" | "success" | "error">("idle");
  let migrationResult = $state<string>("");

  async function handleMigration() {
    if (
      !confirm("Import data from the old utcode.net repository?\nExisting entries will be skipped.")
    ) {
      return;
    }

    migrationState = "running";
    migrationResult = "";

    try {
      const result = await runMigration();
      migrationState = "success";
      migrationResult = [
        `Members: ${result.members.created} created, ${result.members.skipped} skipped`,
        `Articles: ${result.articles.created} created, ${result.articles.skipped} skipped`,
        `Projects: ${result.projects.created} created, ${result.projects.skipped} skipped`,
      ].join("\n");

      const allErrors = [
        ...result.members.errors,
        ...result.articles.errors,
        ...result.projects.errors,
      ];
      if (allErrors.length > 0) {
        migrationResult += `\n\nErrors:\n${allErrors.slice(0, 5).join("\n")}`;
        if (allErrors.length > 5) {
          migrationResult += `\n... and ${allErrors.length - 5} more`;
        }
      }
    } catch (e) {
      migrationState = "error";
      migrationResult = e instanceof Error ? e.message : String(e);
    }
  }
</script>

<section class="animate-fade-slide-in stagger-5">
  <div class="mb-4 flex items-center gap-3">
    <div class="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
      <Zap class="h-4 w-4 text-white" />
    </div>
    <h2 class="font-semibold text-base-content">Quick Actions</h2>
  </div>
  <div class="flex flex-wrap gap-3">
    <a
      href="/admin/members/new"
      class="btn gap-2 border-base-300 bg-base-100 font-medium transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
    >
      <UserPlus class="h-4 w-4" />
      Add Member
    </a>
    <a
      href="/admin/articles/new"
      class="btn gap-2 border-base-300 bg-base-100 font-medium transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
    >
      <Pencil class="h-4 w-4" />
      New Article
    </a>
    <a
      href="/admin/projects/new"
      class="btn gap-2 border-base-300 bg-base-100 font-medium transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
    >
      <Folder class="h-4 w-4" />
      New Project
    </a>
    <button
      onclick={handleMigration}
      disabled={migrationState === "running"}
      class="btn gap-2 border-base-300 bg-base-100 font-medium transition-all hover:border-warning/30 hover:bg-warning/5 hover:text-warning disabled:opacity-50"
    >
      {#if migrationState === "running"}
        <Loader2 class="h-4 w-4 animate-spin" />
        Migrating...
      {:else}
        <DatabaseBackup class="h-4 w-4" />
        Import Legacy Data
      {/if}
    </button>
  </div>

  {#if migrationResult}
    <div
      class="mt-4 rounded-lg p-4 text-sm whitespace-pre-wrap {migrationState === 'success'
        ? 'bg-success/10 text-success'
        : 'bg-error/10 text-error'}"
    >
      {migrationResult}
    </div>
  {/if}
</section>
