/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Maybe } from '@/Maybe';
import { ObservableOptions, TAbstractObservable } from '@/AbstractObservable';

export class Observable<
  TResolve,
  TProvide extends TResolve = TResolve,
> extends TAbstractObservable<TResolve, TProvide> {
  static factory = <TResolveF, TProvideF extends TResolveF = TResolveF>(
    options?: Maybe<ObservableOptions<TProvideF>>
  ) => new Observable<TResolveF, TProvideF>(options);
}
