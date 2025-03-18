/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ObservableOptions } from '@/AbstractObservable';
import { AbstractSelector, getStateCB } from '@/AbstractSelector';
import { Maybe } from '@/Maybe';
import { SyncObserver } from '@/SyncObserver';
import { Observable } from '@/Observable';

export class Selector<
  TResolve,
  TProvide extends TResolve = TResolve,
> extends AbstractSelector<TResolve, TProvide, SyncObserver> {
  static factory = <TResolveF, TProvideF extends TResolveF = TResolveF>(
    getState: getStateCB<TResolveF, TProvideF, SyncObserver>,
    options: Maybe<ObservableOptions<TProvideF>>
  ) => new Selector<TResolveF, TProvideF>(getState, options);

  constructor(
    getState: getStateCB<TResolve, TProvide, SyncObserver>,
    options?: Maybe<ObservableOptions<TProvide>>
  ) {
    super(getState, options, SyncObserver.factory, Observable.factory);
  }
}
