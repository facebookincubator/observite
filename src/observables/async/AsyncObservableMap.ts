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
import { AsyncObservable } from '@/AsyncObservable';
import { AsyncSelector } from '@/AsyncSelector';
import { AsyncObserver } from '@/AsyncObserver';
import { AnyObservable } from '@/AnyObservable';

export class AsyncObservableMap<
  TKey,
  TResolve,
  TProvide extends Promise<TResolve> = Promise<TResolve>,
> extends AbstractObservableMap<TKey, TResolve, TProvide> {
  constructor(
    getDefault?: Maybe<getDefaultCB<TKey, TProvide>>,
    valueOptions?: Maybe<ObservableMapOptions<TKey, TProvide>>
  ) {
    super(getDefault, valueOptions, AsyncObservable.factory);
  }

  /**
   * Convenience selector that can be used to access all items in the map
   */
  entries: AsyncSelector<Array<[TKey, TResolve]>> = new AsyncSelector<
    Array<[TKey, TResolve]>
  >(async ({ observe }: AsyncObserver) => {
    const map = observe(this.map);
    return Promise.all(
      Array.from(map.entries()).map<Promise<[TKey, TResolve]>>(
        async ([key, observable]) => [
          key,
          await observe(
            observable as AnyObservable<TResolve, TProvide>
          ),
        ]
      )
    );
  });
}
