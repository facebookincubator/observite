// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'dist/observite.js', // Entry point from your compiled TypeScript output
  output: {
    file: 'lib/observite.js',
    format: 'esm',
    sourcemap: false,
    banner: `/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
`
  },
  plugins: [resolve(), commonjs()],
};
