/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AnyObservable, AnyObservableMap } from '../observables/AnyObservable';
import { Maybe } from '../utils/Maybe';
import { ThrowMode } from '../utils/StateRef';
import { AbstractObserver } from './AbstractObserver';

export class SyncObserver extends AbstractObserver {
  static factory: () => SyncObserver = () => new SyncObserver();

  observe = <TResolve>(observable: AnyObservable<TResolve>): TResolve => {
    return observable
      .__observeRef(this)
      .getOrThrowSync(ThrowMode.ErrorOnPending);
  };

  observeKey = <TKey, TResolve>(
    observable: AnyObservableMap<TKey, TResolve>,
    key: TKey
  ): Maybe<TResolve> => {
    return observable
      .__observeRef(this, key)
      ?.getOrThrowSync(ThrowMode.ErrorOnPending);
  };
}
