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
import { Selector } from '@/Selector';

export class SelectorMap<
  TKey,
  TResolve,
  TProvide extends TResolve = TResolve,
> extends AbstractSelectorMap<TKey, TResolve, TProvide> {
  constructor(
    getState: getStateCB<TKey, TProvide>,
    options?: Maybe<Options<TKey, TProvide>>
  ) {
    super(getState, options, Selector.factory);
  }
}
