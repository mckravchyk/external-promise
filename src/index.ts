// Copyright 2021 Maciej Krawczyk. All rights reserved.

type PromiseState = 'pending' | 'rejected' | 'resolved';

/* eslint-disable prefer-spread */

// Note that the Promise is not extended so it can compile to ES5. Implements is used to ensure
// that the interface matches a regular Promise.

/**
 * A promise that can be resolved / rejected externally.
 */
export class ExternalPromise<T> implements Promise<T> {
  public readonly [Symbol.toStringTag] = 'ExternalPromise';

  private promise_: Promise<T>;

  private resolvePromise_!: ((value: T) => void) | null;

  private rejectPromise_!: ((reason?: unknown) => void) | null;

  private promiseState_: PromiseState = 'pending';

  constructor() {
    this.promise_ = new Promise((resolve, reject) => {
      this.resolvePromise_ = resolve;
      this.rejectPromise_ = reject;
    });
  }

  public then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
  ): Promise<TResult1 | TResult2> {
    const args: Parameters<Promise<T>['then']> = [];

    if (typeof onfulfilled === 'function') {
      args.push(onfulfilled);
    }

    if (typeof onrejected === 'function') {
      args.push(onrejected);
    }

    return this.promise_.then.apply(this.promise_, args) as Promise<TResult1 | TResult2>;
  }

  public catch<TResult = never>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
  ): Promise<T | TResult> {
    const args: Parameters<Promise<T>['catch']> = [];

    if (typeof onrejected === 'function') {
      args.push(onrejected);
    }

    return this.promise_.catch.apply(this.promise_, args) as Promise<T | TResult>;
  }

  public finally(
    onfinally?: (() => void) | undefined | null,
  ): Promise<T> {
    const args: Parameters<Promise<T>['finally']> = [];

    if (typeof onfinally === 'function') {
      args.push(onfinally);
    }

    return this.promise_.finally.apply(this.promise_, args) as Promise<T>;
  }

  public getState(): PromiseState {
    return this.promiseState_;
  }

  public resolve(value: T): void {
    if (this.promiseState_ !== 'pending') {
      throw new Error('Cannot resolve a non-pending promise');
    }

    this.promiseState_ = 'resolved';
    this.resolvePromise_!(value);
    this.rejectPromise_ = null;
  }

  public reject(reason?: unknown): void {
    if (this.promiseState_ !== 'pending') {
      throw new Error('Cannot reject a non-pending promise');
    }

    this.promiseState_ = 'rejected';
    this.rejectPromise_!(reason);
    this.rejectPromise_ = null;
  }
}
