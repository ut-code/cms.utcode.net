<script lang="ts">
  import { page } from "$app/state";
  import Markdown from "$lib/components/Markdown.svelte";
  import { getPublicProject } from "$lib/data/public.remote";

  const slug = $derived(page.params.slug ?? "");
  const project = $derived(await getPublicProject(slug));
</script>

{#if project}
  <article class="mx-auto max-w-3xl px-6 py-16">
    <a
      href="/projects"
      class="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
    >
      ← プロジェクト一覧
    </a>

    {#if project.coverUrl}
      <img src={project.coverUrl} alt="" class="mb-8 aspect-video w-full rounded-xl object-cover" />
    {/if}

    <h1 class="mb-4 text-4xl font-bold">{project.name}</h1>

    {#if project.description}
      <p class="mb-6 text-lg text-zinc-500">{project.description}</p>
    {/if}

    <div class="mb-8 flex flex-wrap gap-3">
      {#if project.repoUrl}
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-800"
        >
          <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
          GitHub
        </a>
      {/if}
      {#if project.demoUrl}
        <a
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-lg bg-[#00D372] px-4 py-2 text-sm text-zinc-900 hover:bg-[#00C066]"
        >
          Demo →
        </a>
      {/if}
    </div>

    {#if project.content}
      <Markdown content={project.content} />
    {/if}

    <section class="mt-12 border-t border-zinc-200 pt-8">
      <h2 class="mb-4 text-xl font-semibold">メンバー</h2>
      <div class="flex flex-wrap gap-4">
        {#each project.projectMembers as pm (pm.memberId)}
          <a
            href="/members/{pm.member.slug}"
            class="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 hover:border-[#00D372]"
          >
            {#if pm.member.imageUrl}
              <img src={pm.member.imageUrl} alt="" class="h-10 w-10 rounded-full" />
            {:else}
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
                <span class="text-sm font-medium text-zinc-600">
                  {pm.member.name.charAt(0)}
                </span>
              </div>
            {/if}
            <div>
              <div class="font-medium">{pm.member.name}</div>
              {#if pm.role}
                <div class="text-xs text-zinc-500">{pm.role}</div>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    </section>
  </article>
{:else}
  <div class="mx-auto max-w-3xl px-6 py-16 text-center">
    <h1 class="mb-4 text-2xl font-bold">プロジェクトが見つかりません</h1>
    <a href="/projects" class="text-[#00D372] hover:underline">プロジェクト一覧に戻る</a>
  </div>
{/if}
