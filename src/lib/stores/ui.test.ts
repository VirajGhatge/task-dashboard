import { it, expect } from 'vitest';
import { get } from 'svelte/store';
import { createOpen, editOpen, confirm, theme } from './ui';

it('toggles UI stores correctly', () => {
	createOpen.set(true);
	expect(get(createOpen)).toBe(true);

	editOpen.set({ open: true, id: 't-1' });
	expect(get(editOpen)).toEqual({ open: true, id: 't-1' });

	confirm.set({ open: true, id: 't-2' });
	expect(get(confirm).open).toBe(true);

	// theme should be 'light' or 'dark'; flip it
	const curr = get(theme);
	theme.set(curr === 'light' ? 'dark' : 'light');
	expect(get(theme)).not.toBe(curr);
});
