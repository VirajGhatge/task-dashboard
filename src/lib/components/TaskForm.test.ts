import { it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import TaskForm from './TaskForm.svelte';

it('emits submit with trimmed values', async () => {
	const submitSpy = vi.fn();

	const { getByLabelText, getByText } = render(TaskForm, {
		props: { mode: 'create' },
		events: { submit: (e: CustomEvent) => submitSpy(e.detail) }
	});

	const title = getByLabelText(/title/i) as HTMLInputElement;
	const desc = getByLabelText(/description/i) as HTMLTextAreaElement;

	await fireEvent.input(title, { target: { value: '  Hello  ' } });
	await fireEvent.input(desc, { target: { value: '  world ' } });

	await fireEvent.click(getByText('Create'));

	expect(submitSpy).toHaveBeenCalledTimes(1);
	const payload = submitSpy.mock.calls[0][0];
	expect(payload.title).toBe('Hello');
	expect(payload.description).toBe('world');
});
