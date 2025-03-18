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
import { AsyncSelector } from '@/AsyncSelector';
import { AsyncObserver } from '@/AsyncObserver';

export class AsyncSelectorMap<
  TKey,
  TResolve,
  TProvide extends Promise<TResolve> = Promise<TResolve>,
> extends AbstractSelectorMap<TKey, TResolve, TProvide, AsyncObserver> {
  constructor(
    getState: getKeyStateCB<TKey, TProvide>,
    options?: Maybe<SelectorMapOptions<TKey, TProvide>>
  ) {
    super(getState, options, AsyncSelector.factory);
  }
}
