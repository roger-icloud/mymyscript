/**
 * @typedef {Object} DestructuredPromise
 * @property {Promise} promise
 * @property {function} resolve
 * @property {function} reject
 */

/**
 * destructurePromise
 * @returns {{resolve: *, reject: *, promise: Promise<unknown>}}
 */
export function destructurePromise() {
  let resolve;
  let reject;
  const initPromise = new Promise(
    (resolveParam, rejectParam) => {
      resolve = resolveParam;
      reject = rejectParam;
    });
  return { promise: initPromise, resolve, reject };
}


/**
 * @param time
 * @return {{timer: *, promise: Promise}}
 */
export function delay(time) {
  let timer = null;
  const promise = new Promise((resolve) => {
    timer = setTimeout(resolve, time);
  });
  return {
    promise,
    timer,
  };
}

