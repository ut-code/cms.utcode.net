<script lang="ts">
	import { BarChart3, Eye, FileText, FolderKanban, Users } from "lucide-svelte";
	import { getAnalytics } from "$lib/data/private/analytics.remote";

	const analytics = $derived(await getAnalytics());
</script>

<svelte:head>
	<title>Analytics - ut.code(); CMS</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold">Analytics</h1>
	</div>

	<!-- Total Views Summary -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<div class="card bg-base-100 shadow-md">
			<div class="card-body">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-base-content/60">Total Views</p>
						<p class="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
					</div>
					<Eye class="h-8 w-8 text-primary" />
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-md">
			<div class="card-body">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-base-content/60">Article Views</p>
						<p class="text-2xl font-bold">{analytics.totalArticleViews.toLocaleString()}</p>
					</div>
					<FileText class="h-8 w-8 text-secondary" />
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-md">
			<div class="card-body">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-base-content/60">Project Views</p>
						<p class="text-2xl font-bold">{analytics.totalProjectViews.toLocaleString()}</p>
					</div>
					<FolderKanban class="h-8 w-8 text-accent" />
				</div>
			</div>
		</div>

		<div class="card bg-base-100 shadow-md">
			<div class="card-body">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-base-content/60">Member Views</p>
						<p class="text-2xl font-bold">{analytics.totalMemberViews.toLocaleString()}</p>
					</div>
					<Users class="h-8 w-8 text-info" />
				</div>
			</div>
		</div>
	</div>

	<!-- Top Articles -->
	<div class="card bg-base-100 shadow-md">
		<div class="card-body">
			<div class="mb-4 flex items-center gap-2">
				<BarChart3 class="h-5 w-5" />
				<h2 class="card-title">Top Articles</h2>
			</div>
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th>Rank</th>
							<th>Title</th>
							<th>Author</th>
							<th>Views</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each analytics.topArticles as article, index (article.id)}
							<tr class="hover">
								<td class="font-semibold">#{index + 1}</td>
								<td>
									<div class="max-w-md truncate">{article.title}</div>
								</td>
								<td>
									{#if article.author}
										<div class="flex items-center gap-2">
											{#if article.author.imageUrl}
												<img
													src={article.author.imageUrl}
													alt={article.author.name}
													class="h-6 w-6 rounded-full"
												/>
											{/if}
											<span>{article.author.name}</span>
										</div>
									{:else}
										<span class="text-base-content/40">No author</span>
									{/if}
								</td>
								<td>
									<div class="flex items-center gap-1">
										<Eye class="h-4 w-4" />
										<span>{article.viewCount.toLocaleString()}</span>
									</div>
								</td>
								<td>
									<a href="/articles/{article.slug}" class="btn btn-ghost btn-sm" target="_blank">
										View
									</a>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="5" class="text-center text-base-content/60">No articles yet</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Top Projects -->
	<div class="card bg-base-100 shadow-md">
		<div class="card-body">
			<div class="mb-4 flex items-center gap-2">
				<BarChart3 class="h-5 w-5" />
				<h2 class="card-title">Top Projects</h2>
			</div>
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th>Rank</th>
							<th>Name</th>
							<th>Category</th>
							<th>Views</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each analytics.topProjects as project, index (project.id)}
							<tr class="hover">
								<td class="font-semibold">#{index + 1}</td>
								<td>
									<div class="max-w-md truncate">{project.name}</div>
								</td>
								<td>
									<span class="badge badge-outline">{project.category}</span>
								</td>
								<td>
									<div class="flex items-center gap-1">
										<Eye class="h-4 w-4" />
										<span>{project.viewCount.toLocaleString()}</span>
									</div>
								</td>
								<td>
									<a href="/projects/{project.slug}" class="btn btn-ghost btn-sm" target="_blank">
										View
									</a>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="5" class="text-center text-base-content/60">No projects yet</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Top Members -->
	<div class="card bg-base-100 shadow-md">
		<div class="card-body">
			<div class="mb-4 flex items-center gap-2">
				<BarChart3 class="h-5 w-5" />
				<h2 class="card-title">Top Member Pages</h2>
			</div>
			<div class="overflow-x-auto">
				<table class="table">
					<thead>
						<tr>
							<th>Rank</th>
							<th>Name</th>
							<th>Views</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each analytics.topMembers as member, index (member.id)}
							<tr class="hover">
								<td class="font-semibold">#{index + 1}</td>
								<td>
									<div class="flex items-center gap-2">
										{#if member.imageUrl}
											<img
												src={member.imageUrl}
												alt={member.name}
												class="h-8 w-8 rounded-full"
											/>
										{/if}
										<span>{member.name}</span>
									</div>
								</td>
								<td>
									<div class="flex items-center gap-1">
										<Eye class="h-4 w-4" />
										<span>{member.viewCount.toLocaleString()}</span>
									</div>
								</td>
								<td>
									<a href="/members/{member.slug}" class="btn btn-ghost btn-sm" target="_blank">
										View
									</a>
								</td>
							</tr>
						{:else}
							<tr>
								<td colspan="4" class="text-center text-base-content/60">No members yet</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
