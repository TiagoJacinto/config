import { PartialDeep } from 'type-fest';

export type Options = PartialDeep<{
  ratios: Record<'refactoring', number>;
  files: Record<'ts' | 'js', string[]>;
}>;
