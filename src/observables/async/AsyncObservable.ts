/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Maybe } from '@/Maybe';
import { Options, TAbstractObservable } from '@/AbstractObservable';

export class AsyncObservable<TResolve> extends TAbstractObservable<
  TResolve,
  Promise<TResolve>
> {
  static factory = <TResolve>(options?: Maybe<Options<Promise<TResolve>>>) =>
    new AsyncObservable(options);
}
