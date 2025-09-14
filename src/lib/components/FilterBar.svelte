<script lang="ts">
	import { statusFilter, query } from '$lib/stores/tasks';
</script>

<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
	<div class="flex gap-3 items-center">
		<label class="label" for="status">Status</label>
		<select id="status" class="input" bind:value={$statusFilter}>
			<option value="all">All</option>
			<option value="pending">Pending</option>
			<option value="in-progress">In progress</option>
			<option value="completed">Completed</option>
		</select>
	</div>

	<div class="flex items-center gap-2">
		<input class="input w-72" type="search" placeholder="Search tasks…" bind:value={$query} />
	</div>
</div>
