<script lang="ts">
  type Props = {
    members: number;
    projects: number;
    articles: number;
    years: number;
  };

  const { members, projects, articles, years }: Props = $props();
</script>

<section class="border-y border-zinc-200 bg-zinc-50/50 py-16">
  <div
    class="mx-auto flex max-w-6xl flex-wrap justify-center gap-8 px-6 sm:gap-16 lg:justify-between lg:gap-24"
  >
    <div class="text-center">
      <div class="font-[JetBrains_Mono,monospace] text-4xl font-bold text-zinc-900">
        {members}<span class="text-[#00D372]">+</span>
      </div>
      <div class="mt-1 text-sm tracking-wide text-zinc-500 uppercase">Members</div>
    </div>
    <div class="text-center">
      <div class="font-[JetBrains_Mono,monospace] text-4xl font-bold text-zinc-900">
        {projects}<span class="text-[#00D372]">+</span>
      </div>
      <div class="mt-1 text-sm tracking-wide text-zinc-500 uppercase">Projects</div>
    </div>
    <div class="text-center">
      <div class="font-[JetBrains_Mono,monospace] text-4xl font-bold text-zinc-900">
        {articles}
      </div>
      <div class="mt-1 text-sm tracking-wide text-zinc-500 uppercase">Articles</div>
    </div>
    <div class="text-center">
      <div class="font-[JetBrains_Mono,monospace] text-4xl font-bold text-zinc-900">
        {years}<span class="text-[#00D372]">+</span>
      </div>
      <div class="mt-1 text-sm tracking-wide text-zinc-500 uppercase">Years</div>
    </div>
  </div>
</section>
