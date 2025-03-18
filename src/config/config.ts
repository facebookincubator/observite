/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Be sure to call setConfigOptions() before initializing any other modules.
 */

import { ReleaseDelay } from '@/ReleaseDelay';
import { ComparisonMethod } from '@/areEqual';

/**
 * Configuration options for the application.
 */
export type Config = {
  // The default comparison method used to decide if a value has changed.
  defaultComparisonMethod: ComparisonMethod;
  // The default release delay when delay is set to "default" (in milliseconds).
  defaultReleaseDelayMS: number;
  // Default release delay for observables.
  defaultObservableReleaseDelay: ReleaseDelay | number;
  // Default release delay for selectors.
  defaultSelectorReleaseDelay: ReleaseDelay | number;
  // Custom timer functions.
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
  setInterval: typeof setInterval;
  clearInterval: typeof clearInterval;
  setImmediate: (cb: (...args: any[]) => void) => unknown;
};

/**
 * Default configuration values.
 */
let config: Config = {
  // Use shallow equality as the default comparison method to avoid unnecessary
  // re-renders when using spread operators for updates.
  defaultComparisonMethod: ComparisonMethod.ShallowEqual,
  // Wait a frame before releasing (1ms).
  defaultReleaseDelayMS: 1,
  // Base Observables are not worth releasing by default.
  defaultObservableReleaseDelay: ReleaseDelay.Never,
  // Selectors are usually worth releasing by default.
  defaultSelectorReleaseDelay: ReleaseDelay.Default,
  // Use global timers by default.
  setTimeout: window.setTimeout.bind(window),
  clearTimeout: window.clearTimeout.bind(window),
  setInterval: window.setInterval.bind(window),
  clearInterval: window.clearInterval.bind(window),
  setImmediate: (cb: (...args: any[]) => void) => {
    if (typeof setImmediate !== 'undefined') {
      return window.setImmediate(cb);
    }
    return window.setTimeout(cb, 0);
  },
};

export function setConfigOptions(options: Partial<Config>) {
  config = { ...config, ...options };
}

export function getConfig(): Readonly<Config> {
  return config;
}
