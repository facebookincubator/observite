/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Since ReleaseDelay is a union type that includes a number for exact release
 * delays, we need to use a string literal to ensure type safety.
 */
export enum ReleaseDelay {
  Default = 'Default',
  Never = 'Never',
}
