/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  AbstractSelectorMap,
  getStateCB,
  Options,
} from '@/AbstractSelectorMap';
import { Maybe } from '@/Maybe';
import { AsyncSelector } from '@/AsyncSelector';

export class AsyncSelectorMap<TKey, TResolve> extends AbstractSelectorMap<
  TKey,
  TResolve,
  Promise<TResolve>
> {
  constructor(
    getState: getStateCB<TKey, Promise<TResolve>>,
    options?: Maybe<Options<TKey, Promise<TResolve>>>
  ) {
    super(getState, options, AsyncSelector.factory);
  }
}
