/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Maybe } from '@/Maybe';
import { Options, TAbstractObservable } from '@/AbstractObservable';

export class Observable<
  TResolve,
  TProvide extends TResolve = TResolve,
> extends TAbstractObservable<TResolve, TProvide> {
  static factory = <TResolve, TProvide extends TResolve = TResolve>(
    options?: Maybe<Options<TProvide>>
  ) => new Observable<TResolve, TProvide>(options);
}
