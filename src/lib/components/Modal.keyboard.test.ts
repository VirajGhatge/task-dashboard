import { it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Modal from './Modal.svelte';

it('closes on backdrop Enter/Space', async () => {
	const closed = vi.fn();
	const { getByLabelText } = render(Modal, {
		props: { title: 'X', open: true },
		events: { close: closed }
	});

	const backdrop = getByLabelText(/close modal/i);

	await fireEvent.keyDown(backdrop, { key: 'Enter' });
	await fireEvent.keyDown(backdrop, { key: ' ' });
	expect(closed).toHaveBeenCalled();
});
