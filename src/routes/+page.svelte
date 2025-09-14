<script lang="ts">
	import FilterBar from '$lib/components/FilterBar.svelte';
	import TaskCard from '$lib/components/TaskCard.svelte';
	import TaskForm from '$lib/components/TaskForm.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import ConfirmationDialog from '$lib/components/ConfirmationDialog.svelte';
	import { tasks, filteredTasks, initTasks } from '$lib/stores/tasks';
	import { createTask, updateTask, deleteTask } from '$lib/api/task';
	import { createOpen, editOpen, confirm } from '$lib/stores/ui';
	import type { Task } from '$lib/types';
	import { onMount } from 'svelte';
	onMount(() => {
		initTasks();
	});

	let editing: Task | null = null;
	let lastTrigger: HTMLElement | null = null;

	function rememberFocus() {
		lastTrigger = (document.activeElement as HTMLElement) ?? null;
	}

	function restoreFocus() {
		setTimeout(() => lastTrigger?.focus(), 0);
	}

	$: if ($editOpen.open) {
		const id = $editOpen.id;
		editing = ($tasks.find((t) => t.id === id) ?? null) as Task | null;
	}

	function openCreate() {
		rememberFocus();
		createOpen.set(true);
	}

	function closeCreate() {
		createOpen.set(false);
		restoreFocus();
	}

	function openEdit(id: string) {
		rememberFocus();
		editOpen.set({ open: true, id });
	}

	function closeEdit() {
		editOpen.set({ open: false });
		restoreFocus();
	}

	function openConfirm(id: string) {
		rememberFocus();
		confirm.set({ open: true, id });
	}

	async function onCreateSubmit(e: CustomEvent) {
		await createTask(e.detail);
		await initTasks();
		createOpen.set(false);
		restoreFocus();
	}

	async function onEditSubmit(e: CustomEvent) {
		if (!editing) return;
		await updateTask(editing.id, e.detail);
		await initTasks();
		editOpen.set({ open: false });
		restoreFocus();
	}

	async function onDeleteConfirm() {
		try {
			if ($confirm.open && $confirm.id) {
				await deleteTask($confirm.id);
				await initTasks();
			}
		} finally {
			confirm.set({ open: false });
			restoreFocus();
		}
	}

	function onDeleteCancel() {
		confirm.set({ open: false });
		restoreFocus();
	}
</script>

<header class="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
	<h1 class="text-2xl font-semibold">Task Management Dashboard</h1>
	<div class="flex items-center gap-3">
		<button class="btn btn-primary" on:click={openCreate}>+ New Task</button>
	</div>
</header>

<main class="max-w-6xl mx-auto px-4 space-y-6 pb-16">
	<FilterBar />

	<section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each $filteredTasks as task (task.id)}
			<TaskCard
				{task}
				on:edit={(e) => openEdit(e.detail.id)}
				on:delete={(e) => openConfirm(e.detail.id)}
			/>
		{/each}
	</section>
</main>

<!-- Create Modal -->
<Modal title="Create Task" bind:open={$createOpen} on:close={closeCreate}>
	<TaskForm mode="create" on:submit={onCreateSubmit} on:cancel={closeCreate} />
</Modal>

<!-- Edit Modal -->
<Modal title="Edit Task" open={$editOpen.open} on:close={closeEdit}>
	{#if editing}
		<TaskForm mode="edit" initial={editing} on:submit={onEditSubmit} on:cancel={closeEdit} />
	{/if}
</Modal>

<!-- Delete Confirm -->
<ConfirmationDialog
	open={$confirm.open}
	title="Delete Task"
	message="This action cannot be undone."
	danger
	on:confirm={onDeleteConfirm}
	on:cancel={onDeleteCancel}
/>
