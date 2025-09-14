import { it, expect } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { statusFilter, query } from '$lib/stores/tasks';
import FilterBar from './FilterBar.svelte';

it('updates status and query stores', async () => {
	render(FilterBar);

	const select = screen.getByRole('combobox') as HTMLSelectElement;
	await fireEvent.change(select, { target: { value: 'completed' } });
	expect(get(statusFilter)).toBe('completed');

	const input = screen.getByRole('searchbox') as HTMLInputElement;
	await fireEvent.input(input, { target: { value: 'alpha' } });
	expect(get(query)).toBe('alpha');
});
