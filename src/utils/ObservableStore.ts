/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { getConfig } from '@/config';

/**
 * Optional base class for classes containing observables.
 * Injects debug IDs into the observables for logging.
 */
export default class ObservableStore {
  constructor() {
    getConfig().setImmediate(() => {
      const className = this.constructor.name;
      for (const propName in this) {
        const prop: unknown = this[propName];
        if (
          prop != null &&
          prop instanceof Object &&
          'setDebugPrefix' in prop &&
          prop.hasOwnProperty('setDebugPrefix') &&
          typeof prop.setDebugPrefix === 'function'
        ) {
          prop.setDebugPrefix(`${className}::${propName}`);
        }
      }
    });
  }
}
