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
  Options,
} from './AbstractObservableMap';
import { AsyncObservable } from './AsyncObservable';

export class AsyncObservableMap<TKey, TValue> extends AbstractObservableMap<
  TKey,
  Promise<TValue>,
  TValue
> {
  constructor(
    getDefault?: Maybe<getDefaultCB<TKey, Promise<TValue>>>,
    valueOptions?: Maybe<Options<TKey, Promise<TValue>>>
  ) {
    // $FlowFixMe[incompatible-call]
    super(getDefault, valueOptions, AsyncObservable.factory);
  }

  // /**
  //  * Convenience selector that can be used to access all items in the map
  //  */
  // entries: AsyncSelector<Array<[TKey, TValue]>> = new AsyncSelector<
  //   Array<[TKey, TValue]>
  // >(({ observe }: Observer) => {
  //   const map = observe(this.map);
  //   return Promise.all(
  //     Array.from(map.entries()).map<Promise<[TKey, TValue]>, void>(
  //       async ([key, observable]) => [key, await observe(observable)]
  //     )
  //   );
  // });
}
