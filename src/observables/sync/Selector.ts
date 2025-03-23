/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Options } from '@/AbstractObservable';
import { AbstractSelector, getStateCB } from '@/AbstractSelector';
import { Maybe } from '@/Maybe';
import { SyncObserver } from '@/SyncObserver';
import { Observable } from '@/Observable';

export class Selector<
  TResolve,
  TProvide extends TResolve = TResolve,
> extends AbstractSelector<TResolve, TProvide, SyncObserver> {
  static factory = <TResolve, TProvide extends TResolve = TResolve>(
    getState: getStateCB<TResolve, TProvide, SyncObserver>,
    options: Maybe<Options<TProvide>>
  ) => new Selector<TResolve, TProvide>(getState, options);

  constructor(
    getState: getStateCB<TResolve, TProvide, SyncObserver>,
    options?: Maybe<Options<TProvide>>
  ) {
    super(getState, options, SyncObserver.factory, Observable.factory);
  }
}
