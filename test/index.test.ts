import { ExternalPromise } from 'src';

describe('External Promise', () => {
  test('.then()', async () => {
    const p = new ExternalPromise<boolean>();

    let resolvedValue = false;

    const returnVal = p.then((value) => {
      resolvedValue = value;
    });

    p.resolve(true);

    await p;

    expect(resolvedValue).toBe(true);
    expect(returnVal instanceof Promise).toBe(true);
  });

  test('.catch()', async () => {
    const p = new ExternalPromise<boolean>();

    const error = new Error('Test');
    let rejected: Error | null = null;

    const returnVal = p.catch((err) => {
      rejected = err;
    });

    p.reject(error);

    try {
      await p;
    }
    catch (err) {
      //
    }

    expect(rejected).toBe(error);
    expect(returnVal instanceof Promise).toBe(true);
  });

  test('.finally()', async () => {
    let i = 0;

    const cb = () => {
      i += 1;
    };

    const p1 = new ExternalPromise<boolean>();

    const returnVal = p1.finally(cb);

    p1.resolve(true);

    await p1;

    const p2 = new ExternalPromise<boolean>();

    void p2.catch(() => { }).finally(cb);

    p2.reject('test');

    try {
      await p2;
    }
    catch (err) {
      //
    }

    expect(i).toBe(2);
    expect(returnVal instanceof Promise).toBe(true);
  });

  test('The native promise is returned', () => {
    const p = new ExternalPromise<void>();
    expect(p.getPromise() instanceof Promise).toBe(true);
  });

  test('The promise is pending', async () => {
    const p = new ExternalPromise<void>();
    expect(p.getState()).toBe('pending');
    p.resolve();
  });

  test('The promise is resolved', async () => {
    const p = new ExternalPromise();
    setTimeout(() => { p.resolve(true); }, 0);
    expect(await p).toBe(true);
    expect(p.getState()).toBe('resolved');
  });

  test('The promise is rejected', async () => {
    const p = new ExternalPromise();

    const err = new Error('test');

    setTimeout(() => { p.reject(err); }, 0);

    let thrownError: Error | null = null;

    try {
      await p;
    }
    catch (e) {
      thrownError = e as Error;
    }

    expect(thrownError).toBe(err);
    expect(p.getState()).toBe('rejected');
  });

  test('An error is thrown when trying to reject a non-pending promise', () => {
    const p = new ExternalPromise<void>();
    expect(p.getState()).toBe('pending');
    p.resolve();

    let errorThrown = false;

    try {
      p.resolve();
    }
    catch (err) {
      errorThrown = true;
    }

    expect(errorThrown).toBe(true);
  });
});
