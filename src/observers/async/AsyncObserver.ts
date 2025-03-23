/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Use when you need to observe both synchronous and
 * asynchronous observables.
 */

import { AbstractObserver } from '@/AbstractObserver';
import { AnyObservable, AnyObservableMap } from '@/AnyObservable';
import { Maybe } from '@/Maybe';

export class AsyncObserver extends AbstractObserver {
  static factory: () => AsyncObserver = () => new AsyncObserver();

  observe = <TResolve, TProvide>(
    observable: AnyObservable<TResolve, TProvide>
  ): TResolve | TProvide => {
    const ref = observable.__observeRef(this);
    return ref.getOrThrowProvided();
  };

  observeKey = <TKey, TResolve, TProvide>(
    observable: AnyObservableMap<TKey, TResolve, TProvide>,
    key: TKey
  ): Maybe<TResolve | TProvide> => {
    return observable.__observeRef(this, key)?.getOrThrowProvided();
  };
}
