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
import { Observable } from './Observable';

export class ObservableMap<TKey, TValue> extends AbstractObservableMap<
  TKey,
  TValue,
  TValue
> {
  constructor(
    getDefault?: Maybe<getDefaultCB<TKey, TValue>>,
    valueOptions?: Maybe<Options<TKey, TValue>>
  ) {
    super(getDefault, valueOptions, Observable.factory);
  }

  // /**
  //  * Convenience selector that can be used to access all items in the map
  //  */
  // entries: Selector<Array<[TKey, TValue]>> = new Selector<
  //   Array<[TKey, TValue]>
  // >(({ observe }: Observer) => {
  //   const map = observe(this.map);
  //   return Array.from(map.entries()).map<[TKey, TValue], void>(
  //     ([key, observable]) => [key, observe(observable)]
  //   );
  // });
}
