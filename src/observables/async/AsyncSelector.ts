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

export class AsyncSelector<
  TResolve,
  TProvide extends Promise<TResolve> = Promise<TResolve>,
> extends AbstractSelector<TResolve, TProvide, AsyncObserver> {
  static factory = <
    TResolve,
    TProvide extends Promise<TResolve> = Promise<TResolve>,
  >(
    getState: getStateCB<TResolve, TProvide, AsyncObserver>,
    options: Maybe<Options<TProvide>>
  ) => new AsyncSelector<TResolve, TProvide>(getState, options);

  constructor(
    getState: getStateCB<TResolve, TProvide, AsyncObserver>,
    options?: Maybe<Options<TProvide>>
  ) {
    super(getState, options, AsyncObserver.factory, AsyncObservable.factory);
  }
}
