<script lang="ts">
	import type { NewTask, Task, TaskStatus } from '$lib/types';
	import { createEventDispatcher, onMount } from 'svelte';

	export let mode: 'create' | 'edit' = 'create';
	export let initial: Partial<Task> = {};

	type SubmitPayload = NewTask | Partial<Task>;
	const dispatch = createEventDispatcher<{
		submit: SubmitPayload;
		cancel: void;
	}>();

	const TITLE_MAX = 80;
	const DESC_MAX = 300;

	let busy = false;
	let title = initial.title ?? '';
	let description = initial.description ?? '';
	let status: TaskStatus = (initial.status as TaskStatus) ?? 'pending';
	let titleEl: HTMLInputElement;

	function submit(e: Event) {
		e.preventDefault();
		if (busy) return;
		busy = true;
		title = title.trim();
		description = description.trim();
		if (!title.trim()) {
			busy = false;
			titleEl.focus();
			return;
		}
		const payload: SubmitPayload = { title, description, status };
		dispatch('submit', payload);
		busy = false;
	}

	onMount(() => titleEl?.focus());
</script>

<form class="space-y-4" on:submit|preventDefault={submit}>
	<div class="space-y-1">
		<label class="label" for="title">Title<span class="text-red-600">*</span></label>
		<input
			id="title"
			class="input w-full"
			bind:this={titleEl}
			bind:value={title}
			required
			aria-required="true"
			maxlength={TITLE_MAX}
			aria-describedby="title-counter"
		/>
		<div id="title-counter" class="text-xs text-slate-500">{title.length}/{TITLE_MAX}</div>
	</div>
	<div class="space-y-1">
		<label class="label" for="desc">Description</label>
		<textarea
			id="desc"
			class="input w-full h-24"
			bind:value={description}
			maxlength={DESC_MAX}
			aria-describedby="desc-counter"
		></textarea>
		<div id="desc-counter" class="text-xs text-slate-500">{description.length}/{DESC_MAX}</div>
	</div>
	<div class="space-y-1">
		<label class="label" for="status">Status</label>
		<select id="status" class="input" bind:value={status}>
			<option value="pending">Pending</option>
			<option value="in-progress">In progress</option>
			<option value="completed">Completed</option>
		</select>
	</div>
	<div class="flex justify-end gap-3 pt-2">
		<button type="button" class="btn btn-outline" on:click={() => dispatch('cancel')}>Cancel</button
		>
		<button type="submit" class="btn btn-primary" disabled={busy}
			>{busy ? 'Saving…' : mode === 'create' ? 'Create' : 'Save changes'}</button
		>
	</div>
</form>
