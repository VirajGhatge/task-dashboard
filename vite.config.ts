import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],

	// Ensure Svelte resolves browser runtime during tests
	resolve: {
		conditions: ['browser']
	},

	test: {
		environment: 'jsdom',
		setupFiles: ['./src/setupTests.ts'],
		include: ['src/**/*.{test,spec}.{ts,js}'],
		globals: true,
		expect: { requireAssertions: true },
		coverage: {
			provider: 'v8',
			reporter: ['text', 'text-summary', 'html', 'lcov'],
			reportsDirectory: 'coverage',
			lines: 80,
			functions: 80,
			statements: 80,
			branches: 70,
			exclude: [
				'**/node_modules/**',
				'**/.svelte-kit/**',
				'svelte.config.*',
				'vite.config.*',
				'tailwind.config.*',
				'postcss.config.*',
				'eslint.config.*',
				'src/app.d.ts',
				'**/lib/types.ts',
				'src/app.css',
				'src/routes/**'
			]
		}
	}
});
