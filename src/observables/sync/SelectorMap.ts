/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  AbstractSelectorMap,
  getKeyStateCB,
  SelectorMapOptions,
} from '@/AbstractSelectorMap';
import { Maybe } from '@/Maybe';
import { Selector } from '@/Selector';
import { SyncObserver } from '@/SyncObserver';

export class SelectorMap<
  TKey,
  TResolve,
  TProvide extends TResolve = TResolve,
> extends AbstractSelectorMap<TKey, TResolve, TProvide, SyncObserver> {
  constructor(
    getState: getKeyStateCB<TKey, TProvide>,
    options?: Maybe<SelectorMapOptions<TKey, TProvide>>
  ) {
    super(getState, options, Selector.factory);
  }
}
