/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function isPromise<T = any>(value: unknown): value is Promise<T> {
  return (
    value instanceof Promise ||
    (typeof value === 'object' &&
      value !== null &&
      typeof (value as Promise<T>).then === 'function')
  );
}
