<script lang="ts">
	import type { Task } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	export let task: Task;
	const dispatch = createEventDispatcher();

	const statusBadge = {
		pending: 'bg-amber-100 text-amber-800',
		'in-progress': 'bg-sky-100 text-sky-800',
		completed: 'bg-emerald-100 text-emerald-800'
	} as const;
</script>

<article class="card p-4 flex flex-col gap-3 overflow-hidden">
	<div class="flex items-start justify-between gap-4">
		<h3 class="text-base font-semibold truncate break-words">{task.title}</h3>
		<span class={`px-2 py-1 rounded text-xs ${statusBadge[task.status]}`}>{task.status}</span>
	</div>
	{#if task.description}
		<p class="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 break-all min-h-[40px]">
			{task.description}
		</p>
	{:else}
		<div class="min-h-[40px]"></div>
	{/if}
	<div class="flex items-center justify-between text-xs text-slate-500">
		<time datetime={task.createdAt}>{new Date(task.createdAt).toLocaleString()}</time>
		<div class="flex gap-2">
			<button
				class="btn btn-outline h-10 px-3"
				on:click={() => dispatch('edit', { id: task.id })}
				aria-label={`Edit ${task.title}`}>Edit</button
			>
			<button
				class="btn h-10 px-3 bg-red-600 text-white hover:bg-red-700"
				on:click={() => dispatch('delete', { id: task.id })}
				aria-label={`Delete ${task.title}`}>Delete</button
			>
		</div>
	</div>
</article>
