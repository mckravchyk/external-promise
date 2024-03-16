# External Promise

A promise that can be resolved or rejected externally.

## Installation

```
npm install external-promise --save
```

## Basic Usage

```ts
// Initializing the promise
const p = new ExternalPromise();

// Resolving the promise after a timeout
setTimeout(() => { p.resolve(); }, 1000);

// Awaiting the promise
await p;
```

## Documentation

- [Documentation](./docs/api/external_promise.md)

## Practical Example

Example showing 2 API methods. The first method initializes the promise and awaits its resolution. The second method resolves it.

```ts

class Item {
  private name: string;

  private static counter = 1;

  private isBeingRenamed = false;

  private renamePromise: ExternalPromise<string> | null = null;

  public costructor() {
    this.name = `Item ${Item.counter}`;
    Item.counter += 1;
  }

  // This is a simple example and reactions of UI to the state of the instance are not considered.
  // This could easily be a MobX observable where the UI observes isBeingRenamed and name.

  /**
   * An API method that initializes the UI rename process and awaits the operation to complete.
   */
  public async rename(): Promise<string | false> {
    // Cancel previous rename if pending
    if (this.renamePromise && this.renamePromise.getState() === 'pending') {
      this.renamePromise.resolve(false);
    }

    this.isBeingRenamed = true;

    // Initializing the promise
    this.renamePromise = new ExternalPromise();

    // Awaiting the promise
    const result = await this.renamePromise;

    this.isBeingRenamed = false;

    if (result !== false) {
      this.name = result;
    }

    return result;
  }

  /**
   * A method that finalizes or cancels the rename that can be called from another part of the UI
   * when the user has finished renaming.
   */
  public resolveRename(name: string | false): void {
    if (this.promiseRename_ === null) {
      return;
    }

    if (this.promiseRename_?.getState() === 'pending') {
      // Resolving the promise
      this.promiseRename_.resolve(result);
    }

    this.promiseRename_ = null;
  }
}
```
