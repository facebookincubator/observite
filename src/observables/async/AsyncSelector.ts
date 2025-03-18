/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ObservableOptions } from '@/AbstractObservable';
import { AbstractSelector, getStateCB } from '@/AbstractSelector';
import { AsyncObserver } from '@/AsyncObserver';
import { Maybe } from '@/Maybe';
import { AsyncObservable } from '@/AsyncObservable';

export class AsyncSelector<
  TResolve,
  TProvide extends Promise<TResolve> = Promise<TResolve>,
> extends AbstractSelector<TResolve, TProvide, AsyncObserver> {
  static factory = <
    TResolveF,
    TProvideF extends Promise<TResolveF> = Promise<TResolveF>,
  >(
    getState: getStateCB<TResolveF, TProvideF, AsyncObserver>,
    options: Maybe<ObservableOptions<TProvideF>>
  ) => new AsyncSelector<TResolveF, TProvideF>(getState, options);

  constructor(
    getState: getStateCB<TResolve, TProvide, AsyncObserver>,
    options?: Maybe<ObservableOptions<TProvide>>
  ) {
    super(getState, options, AsyncObserver.factory, AsyncObservable.factory);
  }
}
