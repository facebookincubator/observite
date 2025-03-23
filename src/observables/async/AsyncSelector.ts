/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Options } from '@/AbstractObservable';
import { AbstractSelector, getStateCB } from '@/AbstractSelector';
import { AsyncObserver } from '@/AsyncObserver';
import { Maybe } from '@/Maybe';
import { AsyncObservable } from '@/AsyncObservable';

export class AsyncSelector<TResolve> extends AbstractSelector<
  TResolve,
  Promise<TResolve>
> {
  static factory = <TResolve>(
    getState: getStateCB<TResolve, Promise<TResolve>>,
    options: Maybe<Options<Promise<TResolve>>>
  ) => new AsyncSelector<TResolve>(getState, options);

  constructor(
    getState: getStateCB<TResolve, Promise<TResolve>>,
    options?: Maybe<Options<Promise<TResolve>>>
  ) {
    super(getState, options, AsyncObserver.factory, AsyncObservable.factory);
  }
}
