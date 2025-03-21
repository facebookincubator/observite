/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Use when you need to observe both synchronous and asynchronous observables.
 * Instead of returning a promise when in a pending state, throw the promise.
 * This approach is useful in environments like React, which support a
 * <Suspense> wrapper that catches promises and renders a loading state.
 */

import { AbstractObservable, TAbstractObservable } from '@/AbstractObservable';
import { AbstractObservableMap } from '@/AbstractObservableMap';
import { AbstractObserver } from '@/AbstractObserver';
import { Maybe } from '@/Maybe';
import ObservableManager from '@/ObservableManager';
import { ThrowMode } from '@/StateRef';

export class ComponentObserver extends AbstractObserver {
  #isLocked: boolean = false;
  static factory: () => ComponentObserver = () => new ComponentObserver();

  observe = <TResolve, TProvide>(
    observable: TAbstractObservable<TResolve, TProvide>
  ): TResolve => {
    return observable.__observeRef(this).getOrThrowSync(ThrowMode.ThrowPromise);
  };
  observeKey = <TKey, TResolve, TProvide>(
    observable: AbstractObservableMap<TKey, TResolve, TProvide>,
    key: TKey
  ): Maybe<TResolve> => {
    const ref = observable.__observeRef(this, key);
    return ref?.getOrThrowSync(ThrowMode.ThrowPromise);
  };

  lock() {
    this.#isLocked = true;
  }

  unlock() {
    this.#isLocked = false;
  }

  onRender() {
    ObservableManager.changeHandled(this);
  }

  __addObservable(observable: AbstractObservable): void {
    if (this.#isLocked === true) {
      throw new Error('Using ComponentObserver outside of render function');
    }
    super.__addObservable(observable);
  }
}
