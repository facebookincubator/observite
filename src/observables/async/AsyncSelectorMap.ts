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

export class AsyncSelectorMap<
  TKey,
  TResolve,
  TProvide extends Promise<TResolve> = Promise<TResolve>,
> extends AbstractSelectorMap<TKey, TResolve, TProvide> {
  constructor(
    getState: getStateCB<TKey, TProvide>,
    options?: Maybe<Options<TKey, TProvide>>
  ) {
    super(getState, options, AsyncSelector.factory);
  }
}
