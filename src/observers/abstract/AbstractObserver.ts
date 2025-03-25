/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AbstractObservable } from '@/AbstractObservable';
import { AnyObservable, AnyObservableMap } from '@/AnyObservable';
import { AnyObserver } from '@/AnyObserver';
import { Maybe } from '@/Maybe';
import ObservableManager from '@/ObservableManager';
import { AsyncState, Status } from '@/StateRef';

/**
 * Static used for creating unique ids for each observable.
 */
let nextDebugID = 1;

/**
 * Observers monitor Observables, which contain state. An Observer can
 * subscribe to as many Observables as needed, allowing it to detect changes
 * to their combined state. When any of these Observables change, the Observer
 * stops monitoring all of them and restarts observation in the onChange
 * callback. This allows the Observer to adapt to changing conditions by
 * re-evaluating which Observables are relevant, based on the current state
 * of other Observables.
 */
export abstract class AbstractObserver {
  private observables: Set<AbstractObservable> = new Set();
  private onChange: Maybe<() => void> = null;
  private creationOrder: number = nextDebugID++;
  protected debugID: number | string = this.creationOrder;
  protected isComponent: boolean = false;

  constructor(debugPrefix?: Maybe<string>) {
    if (debugPrefix != null) {
      this.setDebugPrefix(debugPrefix);
    }
  }

  /**
   * Should only be called by internal systems.
   */
  __getCreationOrder(): number {
    return this.creationOrder;
  }

  setDebugPrefix(prefix: number | string) {
    this.debugID = `${prefix}::${this.debugID}`;
  }

  setOnChange(onChange: () => void) {
    this.onChange = onChange;
  }

  getIsComponent(): boolean {
    return this.isComponent;
  }

  /**
   * Called when the Observer is no longer needed. Cleans up any resources.
   */
  destroy() {
    this.onChange = null;
    this.reset();
  }

  /**
   * Called to clear subscriptions to all Observables.
   */
  reset() {
    this.observables.forEach((observable) => observable.__removeObserver(this));
    this.observables.clear();
  }

  observeState = <TResolve, TProvide>(
    observable: AnyObservable<TResolve, TProvide>
  ): Readonly<AsyncState<TResolve>> => {
    const state = observable.__observeRef(this).getState();
    if (state.status === Status.Pending) {
      // When the promise finishes, consider it a change event.
      state.promise.then(
        () => ObservableManager.addChangedObserver(this),
        () => ObservableManager.addChangedObserver(this)
      );
    }
    return state;
  };

  observeKeyState = <TKey, TResolve, TProvide>(
    observable: AnyObservableMap<TKey, TResolve, TProvide>,
    key: TKey
  ): Maybe<Readonly<AsyncState<TResolve>>> => {
    const state = observable.__observeRef(this, key)?.getState();
    if (state == null) {
      return null;
    }
    if (state.status === Status.Pending) {
      // When the promise finishes, consider it a change event.
      state.promise.then(
        () => ObservableManager.addChangedObserver(this),
        () => ObservableManager.addChangedObserver(this)
      );
    }
    return state;
  };

  /**
   * Should only be called by internal systems.
   */
  __addObservable(observable: AbstractObservable): void {
    if (this.onChange != null) {
      this.observables.add(observable);
    }
  }

  /**
   * Should only be called by internal systems.
   */
  __observableChanged() {
    this.reset();
    this.onChange?.();
  }
}
