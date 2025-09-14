import { writable, derived } from 'svelte/store';
import type { Task, TaskStatus } from '$lib/types';
import { fetchTasks } from '$lib/api/task';

export const tasks = writable<Task[]>([]);
export const statusFilter = writable<TaskStatus | 'all'>('all');
export const query = writable('');

export const filteredTasks = derived([tasks, statusFilter, query], ([$tasks, $status, $q]) => {
	const q = $q.trim().toLowerCase();
	return $tasks.filter((t) => {
		const byStatus = $status === 'all' || t.status === $status;
		const byQuery =
			!q || t.title.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q);
		return byStatus && byQuery;
	});
});

export async function initTasks() {
	tasks.set(await fetchTasks());
}
