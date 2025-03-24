import { intersperse } from 'ramda';

export type NewLinesBetween = 'ignore' | 'always' | 'never';
export type NewLinesBetweenSeparator = { newlinesBetween: NewLinesBetween };

export const withNewlinesBetween = <T>(arr: T[], newlinesBetween: NewLinesBetween) =>
  intersperse<T | NewLinesBetweenSeparator>({ newlinesBetween }, arr);
