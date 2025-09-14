import { writable } from 'svelte/store';

export const createOpen = writable(false);
export const editOpen = writable<{ open: boolean; id?: string }>({ open: false });
export const confirm = writable<{ open: boolean; id?: string }>({ open: false });
const initialTheme: 'light' | 'dark' =
	typeof localStorage !== 'undefined' && localStorage.getItem('theme') === 'dark'
		? 'dark'
		: 'light';
export const theme = writable<'light' | 'dark'>(initialTheme);
