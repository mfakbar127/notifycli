#!/usr/bin/env bun

/**
 * Post-build script to add shebang to the CLI output
 * Bunup banner option places it after "use strict", which breaks Node.js
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const cliPath = resolve(process.cwd(), 'dist', 'cli.js');

const content = readFileSync(cliPath, 'utf-8');

// Add shebang at the very beginning
const withShebang = `#!/usr/bin/env node\n${content}`;

writeFileSync(cliPath, withShebang, 'utf-8');

console.log('✓ Added shebang to dist/cli.js');
