import { afterEach, expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/svelte';

expect.extend(matchers as unknown as Parameters<typeof expect.extend>[0]);

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});
