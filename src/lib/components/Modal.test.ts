import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Modal from './Modal.svelte';

describe('Modal', () => {
	it('closes on backdrop click', async () => {
		const closed = vi.fn();
		const { getByLabelText } = render(Modal, {
			props: { title: 'X', open: true },
			events: { close: closed }
		});
		await fireEvent.click(getByLabelText(/close modal/i));
		expect(closed).toHaveBeenCalled();
	});

	it('closes on Escape', async () => {
		const closed = vi.fn();
		const { getByRole } = render(Modal, {
			props: { title: 'X', open: true },
			events: { close: closed }
		});
		const dialog = getByRole('dialog');
		await fireEvent.keyDown(dialog, { key: 'Escape' });
		expect(closed).toHaveBeenCalled();
	});
});
