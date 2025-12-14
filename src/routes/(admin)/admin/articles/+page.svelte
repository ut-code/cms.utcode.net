<script lang="ts">
  import { getArticles } from "$lib/data/articles.remote";

  const articles = $derived(await getArticles());
</script>

<svelte:head>
  <title>Articles - ut.code(); CMS</title>
</svelte:head>

<svelte:boundary>
  {#snippet pending()}
    <div class="flex h-64 items-center justify-center">
      <span class="loading loading-md loading-spinner"></span>
    </div>
  {/snippet}

  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-zinc-900">Articles</h1>
        <p class="text-zinc-500">
          {articles.length} articles · {articles.filter((a) => a.published).length} published
        </p>
      </div>
      <a
        href="/admin/articles/new"
        class="inline-flex items-center gap-2 rounded-lg bg-[#00D372] px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-[#00C066]"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Article
      </a>
    </div>

    {#if articles.length === 0}
      <div class="rounded-xl border border-zinc-200 bg-white p-12 text-center">
        <svg
          class="mx-auto h-12 w-12 text-zinc-300"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <h3 class="mt-4 font-semibold text-zinc-900">No articles yet</h3>
        <p class="mt-1 text-sm text-zinc-500">Get started by writing your first article.</p>
        <a
          href="/admin/articles/new"
          class="mt-4 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          New Article
        </a>
      </div>
    {:else}
      <div class="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table class="w-full">
          <thead class="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase"
              >
                Article
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase"
              >
                Author
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase"
              >
                Updated
              </th>
              <th class="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-200">
            {#each articles as article (article.id)}
              <tr class="hover:bg-zinc-50">
                <td class="px-6 py-4">
                  <div>
                    <p class="font-medium text-zinc-900">{article.title}</p>
                    <code class="text-xs text-zinc-400">/{article.slug}</code>
                  </div>
                </td>
                <td class="px-6 py-4">
                  {#if article.author}
                    <div class="flex items-center gap-2">
                      {#if article.author.imageUrl}
                        <img src={article.author.imageUrl} alt="" class="h-6 w-6 rounded-full" />
                      {/if}
                      <span class="text-sm text-zinc-600">{article.author.name}</span>
                    </div>
                  {:else}
                    <span class="text-sm text-zinc-400">—</span>
                  {/if}
                </td>
                <td class="px-6 py-4">
                  {#if article.published}
                    <span
                      class="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700"
                    >
                      Published
                    </span>
                  {:else}
                    <span
                      class="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700"
                    >
                      Draft
                    </span>
                  {/if}
                </td>
                <td class="px-6 py-4 text-sm text-zinc-500">
                  {new Date(article.updatedAt).toLocaleDateString()}
                </td>
                <td class="px-6 py-4 text-right">
                  <a
                    href="/admin/articles/edit/{article.id}"
                    class="text-sm text-[#00D372] hover:underline"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</svelte:boundary>
