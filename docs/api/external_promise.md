# Class: ExternalPromise implements [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

A promise that can be resolved / rejected externally.

Note:
- The class implements `Promise` and does not extend it. This means that `new ExternalPromise() instanceof Promise` will be false.
- The native Promise methods `then`, `catch` and `finally` return the ordinary Promise instance that is stored internally, not the instance.

## `new ExternalPromise()`

Initializes an external promise.

## Instance Methods

### `.getPromise()`

Returns `Promise` - returns the native Promise.

Despite a common interface, ExternalPromise does not extend Promise for backward compatibility reasons. Obtaining the native Promise may be desirable when the Promise is to be exposed externally, i.e. as the return value of a method or a function. This is because instances of ExternalPromise will not pass `p instanceof Promise` check.

### `.getState()`

Returns `string` - 'pending' | 'resolved' | 'rejected'

### `.resolve(value)`

* `value` unknown - the value to resolve the promise with.

Resolves the promise.

### `.reject(reason)`

* `reason` unknown - the value to reject the promise with. An [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) instance is recommended.

Rejects the promise.
