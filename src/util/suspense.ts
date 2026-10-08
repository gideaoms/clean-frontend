import { use } from 'react';

const cache = new Map<string, unknown>();
const JOINER = ':';

export function useSuspense<T>(props: {
  fn: () => Promise<T> | T;
  key: (string | number)[];
}) {
  const key = props.key.join(JOINER);
  if (!cache.has(key)) {
    cache.set(key, props.fn());
  }
  const result = cache.get(key) as Promise<T> | T;
  if (!(result instanceof Promise)) {
    return result;
  }
  return use(result);
}

export function clearSuspense(key?: (string | number)[]) {
  if (key) {
    cache.delete(key.join(JOINER));
    return;
  }
  cache.clear();
}

export function setSuspense<T>(props: { key: (string | number)[]; value: T }) {
  const key = props.key.join(JOINER);
  cache.set(key, props.value);
}
