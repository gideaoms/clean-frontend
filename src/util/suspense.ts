import { use } from 'react';

const cache = new Map<string, unknown>();

export function useSuspense<T>(props: {
  fn: () => Promise<T> | T;
  key: string;
}) {
  if (!cache.has(props.key)) {
    cache.set(props.key, props.fn());
  }
  const result = cache.get(props.key) as Promise<T> | T;
  if (!(result instanceof Promise)) {
    return result;
  }
  return use(result);
}

export function invalidate(key: string) {
  cache.delete(key);
}
