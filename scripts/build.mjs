// Builds dist/ from src/index.js: the same code as an ES module (dist/index.mjs) and as CommonJS
// (dist/index.cjs). Node and server-side renderers (Next.js, Nuxt) load the package with `require` unless
// it says otherwise, and the old single ESM file broke them with "Unexpected token 'export'".
import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';

const source = readFileSync('src/index.js', 'utf8');
const exportLine = 'export default Tap;';
if (source.split(exportLine).length !== 2) {
  throw new Error(`src/index.js must end with exactly one "${exportLine}"`);
}

mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.mjs', source);
writeFileSync('dist/index.cjs', source.replace(exportLine, 'module.exports = Tap;\nmodule.exports.default = Tap;'));
copyFileSync('src/index.d.ts', 'dist/index.d.ts');
console.log('built dist/index.mjs, dist/index.cjs, dist/index.d.ts');
