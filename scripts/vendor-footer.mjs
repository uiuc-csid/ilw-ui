// Refreshes the campus footer content in src/core/campus-footer.ts from the
// brand API, the source <ilw-footer> fetches at runtime. Run with
// `mise run vendor:footer` and review the diff.
import { readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../src/core/campus-footer.ts', import.meta.url);
const res = await fetch('https://api.brand.illinois.edu/footer');
if (!res.ok) throw new Error(`brand API: HTTP ${res.status}`);
const { illinois } = await res.json();

const date = new Date().toISOString().slice(0, 10);
const block = `// BEGIN vendor:footer (fetched ${date})\nexport const campusFooter: CampusFooterData = ${JSON.stringify(illinois, null, 2)};\n// END vendor:footer`;
const src = readFileSync(file, 'utf8');
const markers = /\/\/ BEGIN vendor:footer[\s\S]*?\/\/ END vendor:footer/;
if (!markers.test(src)) throw new Error('vendor:footer markers not found in campus-footer.ts');
writeFileSync(file, src.replace(markers, block));
console.log(`campus-footer.ts: ${illinois.sections.length} sections, fetched ${date}`);
