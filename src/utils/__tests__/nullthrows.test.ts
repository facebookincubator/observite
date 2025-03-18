/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { nullthrows } from '@/nullthrows';

test('nullthrows', () => {
  expect(nullthrows(1, 'should not see')).toBe(1);
  expect(() => nullthrows(null, 'is null')).toThrow('is null');
  expect(() => nullthrows(undefined, 'is undefined')).toThrow('is undefined');
});
