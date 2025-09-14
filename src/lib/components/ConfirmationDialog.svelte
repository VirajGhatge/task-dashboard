<script lang="ts">
	import Modal from './Modal.svelte';
	export let open = false;
	export let message = 'Are you sure?';
	export let confirmText = 'Delete';
	export let cancelText = 'Cancel';
	export let danger = false;
	export let title = 'Confirm';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<Modal {open} {title} on:close={() => dispatch('cancel')}>
	<div class="space-y-6">
		<p class="text-sm">{message}</p>
		<div class="flex justify-end gap-3">
			<button class="btn btn-outline" on:click={() => dispatch('cancel')}>{cancelText}</button>
			<button
				class={`btn ${danger ? 'bg-red-600 text-white hover:bg-red-700' : 'btn-primary'}`}
				on:click={() => dispatch('confirm')}>{confirmText}</button
			>
		</div>
	</div>
</Modal>
