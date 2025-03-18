/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Use when you only need to observe synchronous observables.
 */

import { Maybe } from '@/Maybe';
import { ThrowMode } from '@/StateRef';
import { AbstractObserver } from '@/AbstractObserver';
import { AnyObservable, AnyObservableMap } from '@/AnyObservable';

export class SyncObserver extends AbstractObserver {
  static factory: () => SyncObserver = () => new SyncObserver();

  observe = <TResolve, TProvide>(
    observable: AnyObservable<TResolve, TProvide>
  ): TResolve => {
    const ref = observable.__observeRef(this);
    return ref.getOrThrowSync(ThrowMode.ErrorOnPending);
  };

  observeKey = <TKey, TResolve, TProvide>(
    observable: AnyObservableMap<TKey, TResolve, TProvide>,
    key: TKey
  ): Maybe<TResolve> => {
    const ref = observable.__observeRef(this, key);
    return ref?.getOrThrowSync(ThrowMode.ErrorOnPending);
  };
}
