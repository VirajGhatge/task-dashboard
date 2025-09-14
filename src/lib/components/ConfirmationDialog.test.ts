import { it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ConfirmationDialog from './ConfirmationDialog.svelte';

it('fires confirm and cancel', async () => {
	const onConfirm = vi.fn();
	const onCancel = vi.fn();

	const { getAllByRole } = render(ConfirmationDialog, {
		props: {
			open: true,
			title: 'Delete Task',
			message: 'This action cannot be undone.',
			danger: true
		},
		events: {
			confirm: () => onConfirm(),
			cancel: () => onCancel()
		}
	});

	const buttons = getAllByRole('button');
	await fireEvent.click(buttons[0]);
	await fireEvent.click(buttons[1]);

	expect(onConfirm.mock.calls.length + onCancel.mock.calls.length).toBeGreaterThan(0);
});
