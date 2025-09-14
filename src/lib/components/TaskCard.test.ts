import { it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TaskCard from './TaskCard.svelte';
import type { Task } from '$lib/types';

it('emits edit/delete with id', async () => {
	const task: Task = {
		id: 't-1',
		title: 'Alpha',
		status: 'pending',
		createdAt: new Date().toISOString(),
		description: 'd'
	};

	const onEdit = vi.fn();
	const onDelete = vi.fn();

	const { getByRole } = render(TaskCard, {
		props: { task },
		events: {
			edit: (e: CustomEvent) => onEdit(e.detail),
			delete: (e: CustomEvent) => onDelete(e.detail)
		}
	});

	await fireEvent.click(getByRole('button', { name: /edit/i }));
	await fireEvent.click(getByRole('button', { name: /delete/i }));

	expect(onEdit).toHaveBeenCalledWith({ id: 't-1' });
	expect(onDelete).toHaveBeenCalledWith({ id: 't-1' });
});
