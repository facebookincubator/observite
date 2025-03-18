/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Hand-written type declarations for observite/react.
 * This file imports types from 'observite' instead of bundling them,
 * which ensures type compatibility when using both packages together.
 */

import type { ComponentObserver } from 'observite';

/**
 * Used in React components to create an observer for subscribing to
 * observables. The observer is automatically cleaned up when the component
 * unmounts.
 *
 * @param debugIdPrefix - A prefix to help identify the observer in debug logs
 * @returns A ComponentObserver instance for observing observables
 */
export declare function useObserver(debugIdPrefix?: string): ComponentObserver;
