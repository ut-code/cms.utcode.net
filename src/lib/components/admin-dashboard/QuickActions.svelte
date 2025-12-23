<script lang="ts">
	import { Folder, Pencil, UserPlus, Zap } from "lucide-svelte";
</script>

<section class="animate-fade-slide-in stagger-5">
	<div class="mb-4 flex items-center gap-3">
		<div class="gradient-primary flex h-8 w-8 items-center justify-center rounded-lg">
			<Zap class="h-4 w-4 text-white" />
		</div>
		<h2 class="font-semibold text-base-content">Quick Actions</h2>
	</div>
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
		<a
			href="/admin/members/new"
			class="btn btn-sm gap-2 border-base-300 bg-base-100 font-medium transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary sm:btn-md"
		>
			<UserPlus class="h-4 w-4" />
			Add Member
		</a>
		<a
			href="/admin/articles/new"
			class="btn btn-sm gap-2 border-base-300 bg-base-100 font-medium transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary sm:btn-md"
		>
			<Pencil class="h-4 w-4" />
			New Article
		</a>
		<a
			href="/admin/projects/new"
			class="btn btn-sm gap-2 border-base-300 bg-base-100 font-medium transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary sm:btn-md"
		>
			<Folder class="h-4 w-4" />
			New Project
		</a>
	</div>
</section>
