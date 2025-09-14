<script lang="ts">
	import { createEventDispatcher, tick } from 'svelte';
	import { scale } from 'svelte/transition';
	export let title = '';
	export let open = false;

	const dispatch = createEventDispatcher();
	let dialogEl: HTMLDivElement;

	$: if (open) {
		tick().then(() => {
			const sel = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
			const focusables = dialogEl?.querySelectorAll<HTMLElement>(sel) ?? [];
			const first = focusables[0];
			(first ?? dialogEl)?.focus();
		});
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			dispatch('close');
			return;
		}
		if (e.key === 'Tab') {
			const sel = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
			const f = dialogEl.querySelectorAll<HTMLElement>(sel);
			if (f.length === 0) {
				e.preventDefault();
				dialogEl.focus();
				return;
			}
			const first = f[0];
			const last = f[f.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				last.focus();
				e.preventDefault();
			} else if (!e.shiftKey && document.activeElement === last) {
				first.focus();
				e.preventDefault();
			}
		}
	}
</script>

{#if open}
	<div class="fixed inset-0 z-50 grid place-items-center">
		<button
			type="button"
			class="absolute inset-0 bg-black/40 focus:outline-none"
			aria-label="Close modal"
			on:click={() => dispatch('close')}
			on:keydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					dispatch('close');
				}
			}}
		></button>
		<div
			bind:this={dialogEl}
			class="relative w-[95vw] max-w-xl p-6 card"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			tabindex="-1"
			on:keydown={onKey}
			transition:scale
		>
			<header class="flex items-center justify-between gap-4 mb-4">
				<h2 id="modal-title" class="text-lg font-semibold">{title}</h2>
				<button
					class="btn btn-outline h-10 px-3"
					on:click={() => dispatch('close')}
					aria-label="Close">✕</button
				>
			</header>
			<slot />
		</div>
	</div>
{/if}
