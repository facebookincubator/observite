/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Maybe } from '@/Maybe';
import { Options, TAbstractObservable } from '@/AbstractObservable';

export class AsyncObservable<
  TResolve,
  TProvide extends Promise<TResolve> = Promise<TResolve>,
> extends TAbstractObservable<TResolve, TProvide> {
  static factory = <
    TResolveF,
    TProvideF extends Promise<TResolveF> = Promise<TResolveF>,
  >(
    options?: Maybe<Options<TProvideF>>
  ) => new AsyncObservable<TResolveF, TProvideF>(options);
}
