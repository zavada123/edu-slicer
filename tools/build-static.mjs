// Static build of the slicer for EduProstir: node tools/build-static.mjs [outDir]
//
// Kiri:Moto normally runs behind its own Node server (app.js), which maps URL folders to source folders.
// This script lays the same files out as plain static files, so any web server can serve them,
// under any path prefix (the page computes its base from its own URL, see src/kiri/app/base.js).
// Run `npm run webpack-ext && node bin/esbuild.config.mjs prod` first (npm run build does both).

import fs from 'fs/promises';
import path from 'path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.resolve(process.argv[2] || path.join(root, 'dist'));

// URL folder -> source folder, as app.js serves them (mod.static).
const FOLDERS = [
    ['lib', 'src'],
    ['obj', 'web/obj'],
    ['fon2', 'web/fon2'],
    ['font', 'web/font'],
    ['icon', 'web/icon'],
    ['kiri', 'web/kiri'],
    ['moto', 'web/moto'],
    ['wasm', 'src/wasm'],
    // the workers load wasm next to their own folder (bin/bundle-prod.config.json)
    ['lib/kiri/wasm', 'src/wasm'],
];

// Packed bundles replace the module trees in production (productionMap in app.js).
const PACKED = {
    'lib/main/kiri.js': 'src/pack/kiri-main.js',
    'lib/kiri/run/engine.js': 'src/pack/kiri-eng.js',
    'lib/kiri/run/minion.js': 'src/pack/kiri-pool.js',
    'lib/kiri/run/worker.js': 'src/pack/kiri-work.js',
};

// Source trees under lib/ the slicer page never loads: other apps of grid-apps and build leftovers.
const SKIP = new Set(['src/pack', 'src/void', 'src/mesh', 'src/cli', 'src/dock', 'src/wasm']);

async function copyTree(from, to, skip = new Set()) {
    if (skip.has(path.relative(root, from))) return;
    const stat = await fs.stat(from);
    if (stat.isDirectory()) {
        await fs.mkdir(to, { recursive: true });
        for (const name of await fs.readdir(from)) {
            await copyTree(path.join(from, name), path.join(to, name), skip);
        }
    } else {
        // fs.copyFile follows symlinks (web/font, src/ext/*), so the output holds real files.
        await fs.copyFile(from, to);
    }
}

async function main() {
    await fs.rm(out, { recursive: true, force: true });
    for (const [url, src] of FOLDERS) {
        await copyTree(path.join(root, src), path.join(out, url), url === 'lib' ? SKIP : undefined);
    }
    for (const [url, src] of Object.entries(PACKED)) {
        await fs.mkdir(path.dirname(path.join(out, url)), { recursive: true });
        await fs.copyFile(path.join(root, src), path.join(out, url));
    }
    // The site root opens the slicer.
    await fs.writeFile(path.join(out, 'index.html'),
        '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=kiri/"><a href="kiri/">kiri/</a>\n');
    console.log(`static build in ${path.relative(process.cwd(), out) || '.'}`);
}

main().catch(err => { console.error(err); process.exit(1); });
