import { defineConfig } from 'bunup';

export default defineConfig({
	entry: ['src/cli.ts'],
	format: ['esm'],
	dts: false,
	clean: true,
	banner: '#!/usr/bin/env node',
});
