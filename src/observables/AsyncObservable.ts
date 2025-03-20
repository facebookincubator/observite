/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Maybe } from '../utils/Maybe';
import { Options, TAbstractObservable } from './AbstractObservable';

export class AsyncObservable<T> extends TAbstractObservable<Promise<T>, T> {
  static factory = <T>(options?: Maybe<Options<Promise<T>>>) =>
    new AsyncObservable(options);
}
