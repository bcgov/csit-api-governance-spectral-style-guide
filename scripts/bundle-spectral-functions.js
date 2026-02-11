#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const SRC_DIR = path.resolve('__main__/src/js/spectral/functions');
const OUT_DIR = path.resolve('dist/spectral/functions');

async function bundleFunction(entryFile) {
  const inputPath = path.join(SRC_DIR, entryFile);
  const outputPath = path.join(OUT_DIR, entryFile);

  const bundle = await rollup({
    input: inputPath,
    plugins: [
      resolve({
        preferBuiltins: false,
      }),
      commonjs(),
    ],
    onwarn(warning, warn) {
      // Ignore circular dependency warnings (common with small helpers)
      if (warning.code === 'CIRCULAR_DEPENDENCY') return;
      warn(warning);
    },
  });

  await bundle.write({
    file: outputPath,
    format: 'es',
    exports: 'default',
    sourcemap: false,
  });

  await bundle.close();
  console.log(`✔ Bundled ${entryFile}`);
}

async function run() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

const files = fs.readdirSync(SRC_DIR).filter((f) => {
  if (!f.endsWith('.js')) return false;
  if (f.startsWith('shared-')) return false;

  return fs.statSync(path.join(SRC_DIR, f)).isFile();
});

  if (files.length === 0) {
    console.error('No .js files found in src/functions');
    process.exit(1);
  }

  for (const file of files) {
    await bundleFunction(file);
  }

  console.log('\n🎉 Spectral functions bundled successfully');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
