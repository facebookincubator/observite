/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Maybe } from '../utils/Maybe';
import { Options, TAbstractObservable } from './AbstractObservable';

export class Observable<TResolve> extends TAbstractObservable<
  TResolve,
  TResolve
> {
  static factory = <TResolve>(options?: Maybe<Options<TResolve>>) =>
    new Observable(options);
}
