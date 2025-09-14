import seed from '$lib/data/task.json';
import type { Task, NewTask, TaskStatus } from '$lib/types';

const KEY = 'task-dashboard:v1:tasks';
const TITLE_MAX = 80;
const DESC_MAX = 300;
const STATUSES = new Set<TaskStatus>(['pending', 'in-progress', 'completed']);
function validStatus(s: unknown): TaskStatus {
	if (typeof s === 'string' && STATUSES.has(s as TaskStatus)) {
		return s as TaskStatus;
	}
	return 'pending';
}

function load(): Task[] {
	if (typeof localStorage === 'undefined') return seed as Task[];
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return save(seed as Task[]);
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as Task[]) : save(seed as Task[]);
	} catch {
		return save(seed as Task[]);
	}
}

function save(list: Task[]): Task[] {
	try {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(KEY, JSON.stringify(list));
		}
	} catch {
		// quota or privacy mode; do nothing but keep runtime state
		console.warn('localStorage save failed; continuing in-memory');
	}
	return list;
}

export async function fetchTasks(): Promise<Task[]> {
	return load();
}

export async function createTask(input: NewTask): Promise<Task> {
	const list = load();
	const uid =
		typeof crypto?.randomUUID === 'function'
			? crypto.randomUUID()
			: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
	const task: Task = {
		id: uid,
		createdAt: new Date().toISOString(),
		title: input.title.slice(0, TITLE_MAX),
		description: input.description?.slice(0, DESC_MAX),
		status: validStatus(input.status)
	};
	save([task, ...list]);
	return task;
}

export async function updateTask(
	id: string,
	patch: Partial<Omit<Task, 'id' | 'createdAt'>>
): Promise<Task> {
	const list = load();
	const idx = list.findIndex((t) => t.id === id);
	if (idx === -1) throw new Error('Task not found');
	const next = {
		...list[idx],
		...(patch.title !== undefined ? { title: String(patch.title).slice(0, TITLE_MAX) } : {}),
		...(patch.description !== undefined
			? { description: String(patch.description).slice(0, DESC_MAX) }
			: {}),
		...(patch.status !== undefined ? { status: validStatus(patch.status) } : {})
	} as Task;
	list[idx] = next;
	save(list);
	return next;
}

export async function deleteTask(id: string): Promise<void> {
	const list = load().filter((t) => t.id !== id);
	save(list);
}
