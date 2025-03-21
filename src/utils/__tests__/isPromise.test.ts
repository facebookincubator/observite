/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { isPromise } from '@/isPromise';

test('isPromise', () => {
  expect(isPromise('not a promise')).toBe(false);
  expect(isPromise(new Promise(() => {}))).toBe(true);
});
