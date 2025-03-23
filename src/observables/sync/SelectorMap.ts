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

export class SelectorMap<TKey, TResolve> extends AbstractSelectorMap<
  TKey,
  TResolve,
  TResolve
> {
  constructor(
    getState: getStateCB<TKey, TResolve>,
    options?: Maybe<Options<TKey, TResolve>>
  ) {
    super(getState, options, Selector.factory);
  }
}
