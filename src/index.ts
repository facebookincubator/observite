/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { isPromise } from './utils/isPromise';

const notAPromise = 'not a promise';
const isAPromise = new Promise(() => {});

const doSomethingWithAPromise = (thing: unknown) => {
  if (isPromise(thing)) {
    thing.then(() => {});
  }
};

doSomethingWithAPromise(notAPromise);
doSomethingWithAPromise(isAPromise);

console.log('Finished');
