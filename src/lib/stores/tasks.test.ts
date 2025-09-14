import { describe, it, expect, beforeEach } from 'vitest';
import { tasks, statusFilter, query, filteredTasks } from './tasks';
import type { Task } from '$lib/types';
import { get } from 'svelte/store';

const now = new Date().toISOString();
const data: Task[] = [
	{ id: 'a', title: 'Alpha', status: 'pending', createdAt: now },
	{ id: 'b', title: 'Beta build', status: 'completed', createdAt: now, description: 'done' },
	{ id: 'c', title: 'Gamma draft', status: 'in-progress', createdAt: now, description: 'wip' }
];

beforeEach(() => {
	tasks.set(data);
	statusFilter.set('all');
	query.set('');
});

describe('filteredTasks', () => {
	it('filters by status', () => {
		statusFilter.set('completed');
		const out = get(filteredTasks);
		expect(out).toHaveLength(1);
		expect(out[0].id).toBe('b');
	});

	it('filters by query', () => {
		query.set('alp');
		const out = get(filteredTasks);
		expect(out.map((t) => t.id)).toEqual(['a']);
	});

	it('applies status + query together', () => {
		statusFilter.set('in-progress');
		query.set('ga');
		const out = get(filteredTasks);
		expect(out.map((t) => t.id)).toEqual(['c']);
	});

	it('returns all when status=all and empty query', () => {
		const out = get(filteredTasks);
		expect(out).toHaveLength(3);
	});
});
