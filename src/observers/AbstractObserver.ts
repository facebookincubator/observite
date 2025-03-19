/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { isPromise } from '../utils/isPromise';
import { Maybe } from '../utils/Maybe';

type Observable = { removeObserver: (observer: AbstractObserver) => void };
type ObservableManager = {
  addChangedObserver: (observer: AbstractObserver) => void;
};
type ObservableOrSelector<_TProvide, _TResolve> = Observable;

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
abstract class AbstractObserver {
  protected creationOrder: number = nextDebugID++;
  protected debugID: number | string = this.creationOrder;
  private observables: Set<Observable> = new Set();
  private onChange: Maybe<() => void> = null;

  constructor(debugPrefix?: Maybe<string>) {
    if (debugPrefix != null) {
      this.setDebugPrefix(debugPrefix);
    }
  }

  setDebugPrefix(prefix: number | string) {
    this.debugID = `${prefix}::${this.debugID}`;
  }

  setOnChange(onChange: () => void) {
    this.onChange = onChange;
  }

  // Called when the Observer is no longer needed. Cleans up any resources.
  destroy() {
    this.onChange = null;
    this.reset();
  }

  // Called to clear subscriptions to all Observables.
  reset() {
    this.observables.forEach((observable) => observable.removeObserver(this));
    this.observables.clear();
  }

  //   observeState = <TProvide, TResolve>(
  //     observable: ObservableOrSelector<TProvide, TResolve>
  //   ): AsyncState<TResolve> => {
  //     try {
  //       return LoadObject.withValue(
  //         observable.observeRef(this).getOrThrowSync('throwPromise')
  //       );
  //     } catch (e) {
  //       if (isPromise(e)) {
  //         e.then(
  //           () => ObservableManager.addChangedObserver(this),
  //           () => ObservableManager.addChangedObserver(this)
  //         );
  //         return LoadObject.loading();
  //       } else {
  //         return LoadObject.withError(e);
  //       }
  //     }
  //   };

  // observeLoadObjectKey: <TKey, TProvide, TResolve>(
  //   ObservableOrSelectorMap<TKey, TProvide, TResolve>,
  //   TKey,
  // ) => LoadObject<?TResolve> = <TKey, TProvide, TResolve>(
  //   observable: ObservableOrSelectorMap<TKey, TProvide, TResolve>,
  //   key: TKey,
  // ): LoadObject<?TResolve> => {
  //   try {
  //     return LoadObject.withValue(
  //       observable.observeRef(this, key)?.getOrThrowSync('throwPromise'),
  //     );
  //   } catch (e) {
  //     if (!isPromise(e)) {
  //       clog.info('Caught while observing key', this.debugID, key);
  //     }
  //     if (isPromise(e)) {
  //       promiseDone(
  //         e,
  //         () => ObservableManager.addChangedObserver(this),
  //         () => ObservableManager.addChangedObserver(this),
  //       );
  //       return LoadObject.loading();
  //     } else {
  //       return LoadObject.withError(e);
  //     }
  //   }
  // };

  protected addObservable(observable: Observable): void {
    if (this.onChange != null) {
      this.observables.add(observable);
    }
  }

  protected observableChanged() {
    this.reset();
    this.onChange?.();
  }
}
