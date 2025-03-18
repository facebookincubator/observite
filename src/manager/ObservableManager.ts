/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * ObservableManager is responsible for queuing Observers to be notified in a
 * breadth-first manner, rather than depth-first. This approach minimizes
 * unnecessary updates and ensures consistency across dependent Observables.
 *
 * Consider an Observable called Galaxy that stores information about the
 * galaxy. There are two Selectors: SolarSystems, which extracts solar systems
 * from the Galaxy, and Planets, which extracts planets. An Observer called
 * Person combines information from SolarSystems and Planets to derive insights
 * about the Universe. What happens when a new solar system is added to the
 * Galaxy?
 *
 *          SolarSystems
 *        /              \
 * Galaxy                  Person
 *        \              /
 *            Planets
 *
 * Without ObservableManager, updates would proceed as follows:
 * - Galaxy updates and informs SolarSystems to update.
 * - SolarSystems updates and informs Person to update.
 * - Galaxy informs Planets to update.
 * - Planets updates and informs Person to update again.
 *
 * As the tree grows, more unnecessary updates occur. Additionally, Person
 * might fail to compute its state correctly if it receives SolarSystems with
 * planets that aren't yet updated in Planets.
 *
 * During updates, Observers may start and stop observing frequently.
 * ObservableManager helps prevent thrashing of reference count checks and
 * avoids premature state release by deferring these checks until the update
 * completes.
 */

import { AbstractObservable } from '@/AbstractObservable';
import { AbstractObserver } from '@/AbstractObserver';
import { getConfig } from '@/config';

class ObservableManager {
  private isUpdating = false;
  private pendingChanges: Set<AbstractObserver> = new Set();
  private observablesToCheck: Set<AbstractObservable> = new Set();
  private pendingComponentUpdates: Set<AbstractObserver> = new Set();

  /**
   * Queues all observers of a given observable for notification updates.
   */
  addChangedObservers(
    observable: AbstractObservable,
    observers: Set<AbstractObserver>
  ) {
    observers.forEach(this.addChangedObserverImpl);
    this.deferredCheckForNoObservers(observable);
  }

  /**
   * Queues a change for the specified observer.
   */
  addChangedObserver(observer: AbstractObserver) {
    this.addChangedObserverImpl(observer);
    this.update();
  }

  private addChangedObserverImpl = (observer: AbstractObserver) => {
    this.pendingChanges.add(observer);
  };

  /**
   * Schedules a check for an observable that has no more observers.
   */
  deferredCheckForNoObservers(observable: AbstractObservable) {
    this.observablesToCheck.add(observable);
    this.update();
  }

  /**
   * Initiates the process of processing the queue if it hasn't started yet.
   */
  private update() {
    if (this.isUpdating === false) {
      this.isUpdating = true;
      getConfig().setImmediate(() => this.flushQueue());
    }
  }

  /**
   * Marks a change as handled for the specified observer, removing any pending
   * component updates if present.
   */
  changeHandled(observer: AbstractObserver) {
    // Remove any pending update, as the component may have already rendered.
    this.pendingComponentUpdates.delete(observer);
  }

  /**
   * Processes the queue of pending changes, ensuring that updates are handled
   * in the correct order. This method assumes the process hasn't started yet.
   */
  private flushQueue(): void {
    // Continuously process the queue to handle dynamic changes that may occur
    // during processing, ensuring no updates are missed.
    while (this.pendingChanges.size > 0) {
      // Sorting by creation order helps maintain a predictable update sequence,
      // which is crucial for handling dependencies correctly. Although solving
      // the dependency tree would be ideal, this approach is currently fast enough.
      const changedQueue = Array.from(this.pendingChanges).sort(
        (a, b) => a.__getCreationOrder() - b.__getCreationOrder()
      );
      const observer = changedQueue[0];
      this.pendingChanges.delete(observer);
      if (observer.getIsComponent()) {
        // Component updates are deferred to ensure they are processed separately,
        // allowing for batch updates and reducing unnecessary re-renders.
        this.pendingComponentUpdates.add(observer);
      } else {
        observer.__observableChanged();
      }
    }

    // Sort the list of components we need to update by their creation order.
    // This ensures that parent components render before their children, maintaining
    // the correct rendering hierarchy and preventing potential rendering issues.
    const componentObservers = Array.from(this.pendingComponentUpdates);
    componentObservers.sort(
      (a, b) => a.__getCreationOrder() - b.__getCreationOrder()
    );
    componentObservers.forEach((observer) => {
      // The set of pending component updates can change during rendering due to
      // new updates being triggered. Therefore, we only proceed with updates for
      // components that are still in the original set to avoid redundant operations.
      if (this.pendingComponentUpdates.has(observer)) {
        observer.__observableChanged();
      }
    });

    // Perform reference counter checks on any Observables that have been updated.
    // This helps identify and clean up Observables that no longer have any observers,
    // preventing memory leaks and ensuring efficient resource management.
    this.observablesToCheck.forEach((observable) =>
      observable.__checkForNoObservers()
    );
    // Clear the state for the next update cycle to ensure that the system is ready
    // for new changes and does not carry over any stale data from the previous cycle.
    this.observablesToCheck.clear();
    this.pendingComponentUpdates.clear();
    this.isUpdating = false;
  }
}

const manager: ObservableManager = new ObservableManager();
export default manager;
