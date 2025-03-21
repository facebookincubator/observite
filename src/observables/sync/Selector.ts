/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Options } from '@/AbstractObservable';
import { AbstractSelector, getStateCB } from '@/AbstractSelector';
import { Maybe } from '@/Maybe';
import { SyncObserver } from '@/SyncObserver';
import { Observable } from './Observable';

export class Selector<TResolve> extends AbstractSelector<TResolve, TResolve> {
  static factory = <TResolve>(
    getState: getStateCB<TResolve, TResolve>,
    options: Maybe<Options<TResolve>>
  ) => new Selector<TResolve>(getState, options);

  constructor(
    getState: getStateCB<TResolve, TResolve>,
    options?: Maybe<Options<TResolve>>
  ) {
    super(getState, options, SyncObserver.factory, Observable.factory);
  }
}
