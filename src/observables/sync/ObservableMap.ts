/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Maybe } from '@/Maybe';
import {
  AbstractObservableMap,
  getDefaultCB,
  ObservableMapOptions,
} from '@/AbstractObservableMap';
import { Observable } from '@/Observable';
import { Selector } from '@/Selector';
import { SyncObserver } from '@/SyncObserver';
import { AnyObservable } from '@/AnyObservable';

export class ObservableMap<
  TKey,
  TResolve,
  TProvide extends TResolve = TResolve,
> extends AbstractObservableMap<TKey, TResolve, TProvide> {
  constructor(
    getDefault?: Maybe<getDefaultCB<TKey, TProvide>>,
    valueOptions?: Maybe<ObservableMapOptions<TKey, TProvide>>
  ) {
    super(getDefault, valueOptions, Observable.factory);
  }

  /**
   * Convenience selector that can be used to access all items in the map
   */
  entries: Selector<Array<[TKey, TResolve]>> = new Selector<
    Array<[TKey, TResolve]>
  >(({ observe }: SyncObserver) => {
    const map = observe(this.map);
    return Array.from(map.entries()).map<[TKey, TResolve]>(
      ([key, observable]) => [
        key,
        observe(observable as AnyObservable<TResolve, TProvide>),
      ]
    );
  });
}
