import { intersperse } from 'ramda';

export const withNewlinesBetween = <T>(
  arr: T[],
  newlinesBetween: 'ignore' | 'always' | 'never' | undefined
) => intersperse<T | { newlinesBetween: typeof newlinesBetween }>({ newlinesBetween }, arr);
