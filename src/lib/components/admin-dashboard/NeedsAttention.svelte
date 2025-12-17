<script lang="ts">
  import { AlertCircle, SquarePen, ArrowRight } from "lucide-svelte";

  interface DraftArticle {
    id: string;
    title: string;
    updatedAt: Date;
  }

  interface Props {
    draftArticles: DraftArticle[];
    formatDate: (date: Date) => string;
  }

  const { draftArticles, formatDate }: Props = $props();
</script>

{#if draftArticles.length > 0}
  <section class="animate-fade-slide-in stagger-5 glow-soft rounded-2xl bg-base-100 p-6">
    <div class="mb-4 flex items-center gap-3">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10">
        <AlertCircle class="h-4 w-4 text-warning" />
      </div>
      <h2 class="font-semibold text-base-content">Needs Attention</h2>
      <span class="ml-auto rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
        {draftArticles.length} drafts
      </span>
    </div>
    <div class="space-y-2">
      {#each draftArticles as draft (draft.id)}
        <a
          href="/admin/articles/edit/{draft.id}"
          class="group flex items-center gap-3 rounded-xl bg-base-200/50 p-3 transition-all hover:bg-base-200"
        >
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
            <SquarePen class="h-4 w-4 text-warning" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-base-content">{draft.title}</p>
            <p class="text-xs text-base-content/40">Updated {formatDate(draft.updatedAt)}</p>
          </div>
          <ArrowRight
            class="h-4 w-4 text-base-content/20 transition-all group-hover:translate-x-1 group-hover:text-warning"
          />
        </a>
      {/each}
    </div>
  </section>
{/if}
