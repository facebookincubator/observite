/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function nullthrows<T = unknown>(value: T, message: string): T {
  if (value != null) {
    return value;
  }
  throw new Error(message);
}
