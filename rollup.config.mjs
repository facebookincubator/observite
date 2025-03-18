// rollup.config.mjs
import resolve from '@rollup/plugin-node-resolve';
import { copyFileSync } from 'fs';

const banner = `/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
`;

// Plugin to copy handwritten type declarations for react package
// This ensures types import from 'observite' instead of bundling/inlining them
const copyReactTypesPlugin = {
  name: 'copy-react-types',
  writeBundle() {
    copyFileSync('src/observite-react.d.ts', 'lib/observite-react.d.ts');
  }
};

// Plugin to rewrite observite imports to the package name
const rewriteObservitePlugin = {
  name: 'rewrite-observite-import',
  resolveId(source, importer) {
    // Check if this is an import to the main observite module
    // Source will be relative paths like ../../observite or ./observite
    if (importer) {
      const normalizedSource = source.replace(/\\/g, '/');
      // Match imports ending with /observite or /observite.js (but not observite-react)
      if (
        (normalizedSource.endsWith('/observite') || normalizedSource.endsWith('/observite.js') || normalizedSource === './observite' || normalizedSource === './observite.js') &&
        !normalizedSource.includes('react')
      ) {
        return { id: 'observite', external: true };
      }
    }
    return null;
  }
};

export default [
  // Main observite bundle - ESM format (primary, supports class extension)
  {
    input: 'dist/observite.js',
    output: {
      file: 'lib/observite.mjs',
      format: 'es',
      sourcemap: false,
      banner,
      exports: 'named',
    },
    plugins: [resolve()],
  },
  // Main observite bundle - CJS format (legacy support)
  {
    input: 'dist/observite.js',
    output: {
      file: 'lib/observite.cjs',
      format: 'cjs',
      sourcemap: false,
      banner,
      exports: 'named',
      outro: `module.exports = exports;`,
    },
    plugins: [resolve()],
  },
  // Main observite bundle - .js CJS format (default fallback for direct file imports)
  {
    input: 'dist/observite.js',
    output: {
      file: 'lib/observite.js',
      format: 'cjs',
      sourcemap: false,
      banner,
      exports: 'named',
      outro: `module.exports = exports;`,
    },
    plugins: [resolve()],
  },
  // React bundle - ESM format
  {
    input: 'dist/observite-react.js',
    output: {
      file: 'lib/observite-react.mjs',
      format: 'es',
      sourcemap: false,
      banner,
      exports: 'named',
    },
    external: ['react'],
    plugins: [rewriteObservitePlugin, resolve()],
  },
  // React bundle - CJS format
  {
    input: 'dist/observite-react.js',
    output: {
      file: 'lib/observite-react.cjs',
      format: 'cjs',
      sourcemap: false,
      banner,
      exports: 'named',
      outro: `module.exports = exports;`,
    },
    external: ['react'],
    plugins: [rewriteObservitePlugin, resolve()],
  },
  // React bundle - .js CJS format (default fallback for direct file imports)
  {
    input: 'dist/observite-react.js',
    output: {
      file: 'lib/observite-react.js',
      format: 'cjs',
      sourcemap: false,
      banner,
      exports: 'named',
      outro: `module.exports = exports;`,
    },
    external: ['react'],
    plugins: [rewriteObservitePlugin, resolve(), copyReactTypesPlugin],
  },
];
