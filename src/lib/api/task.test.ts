import { describe, it, expect, beforeEach } from 'vitest';
import { fetchTasks, createTask, updateTask, deleteTask } from '$lib/api/task';
import type { NewTask, TaskStatus } from '$lib/types';

const KEY = 'task-dashboard:v1:tasks';
const long = (n: number) => 'x'.repeat(n);

beforeEach(() => localStorage.clear());

describe('API shim', () => {
	it('creates a task and clamps title/description; normalizes status', async () => {
		const input: NewTask = {
			title: long(500),
			description: long(2000),
			// @ts-expect-error invalid on purpose
			status: 'not-a-status'
		};
		const t = await createTask(input);
		expect(t.id).toBeTruthy();
		expect(t.title.length).toBeLessThanOrEqual(80);
		expect(t.description?.length ?? 0).toBeLessThanOrEqual(300);
		expect(t.status).toBe<'pending'>('pending');
	});

	it('falls back to seed when localStorage is corrupted', async () => {
		localStorage.setItem(KEY, '{not json');
		const list = await fetchTasks();
		expect(Array.isArray(list)).toBe(true);
		expect(list.length).toBeGreaterThan(0);
	});

	it('updates fields with clamping and status validation', async () => {
		const a = await createTask({ title: 'A', description: 'd', status: 'pending' });
		const next = await updateTask(a.id, {
			title: long(200),
			// @ts-expect-error invalid on purpose
			status: 'bad' as unknown as TaskStatus
		});
		expect(next.title.length).toBeLessThanOrEqual(80);
		expect(next.status).toBe('pending');
	});

	it('deletes by id', async () => {
		const a = await createTask({ title: 'A', description: '', status: 'pending' });
		const b = await createTask({ title: 'B', description: '', status: 'completed' });
		let list = await fetchTasks();
		expect(list.some((t) => t.id === a.id)).toBe(true);
		await deleteTask(a.id);
		list = await fetchTasks();
		expect(list.some((t) => t.id === a.id)).toBe(false);
		expect(list.some((t) => t.id === b.id)).toBe(true);
	});

	it('generates an id for created tasks (UUID when available, fallback otherwise)', async () => {
		const c = globalThis.crypto as Partial<Crypto> & {
			randomUUID?: (() => string) | undefined;
		};

		const t = await createTask({ title: 'X', description: '', status: 'pending' });

		const hasRandom = typeof c.randomUUID === 'function';

		if (hasRandom) {
			const uuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
			expect(uuidLike.test(t.id)).toBe(true);
		} else {
			expect(t.id.startsWith('t-')).toBe(true);
		}
	});
});
