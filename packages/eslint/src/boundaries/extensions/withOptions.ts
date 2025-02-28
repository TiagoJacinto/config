import { Linter } from 'eslint';
import { toPairs, flatten } from 'ramda';

type ImportKind = 'value' | 'type' | 'typeof';

type Import<T extends string = string> = {
  name: T | T[];
  importKind: 'all' | ImportKind | ImportKind[];
};

type Options<T extends string> = Record<
  T,
  Partial<{
    capture: Record<string, string>;
    packages: Partial<Import>[];
    dependsOn: Partial<Import<T>>[];
  }>
>;

export default <T extends string>(options: Options<T>) =>
  [
    {
      rules: {
        'boundaries/element-types': [
          'error',
          {
            default: 'disallow',
            message:
              "No rule allowing this dependency when containing the import kind '${dependency.importKind}' was found. File is of type '${file.type}'. Dependency is of type '${dependency.type}'",
            rules: flatten(
              toPairs(options).map(([from, { dependsOn }]) => adaptImports(from, dependsOn))
            ),
          },
        ],
        'boundaries/external': [
          'error',
          {
            default: 'disallow',
            message:
              "No rule allows the usage of external module '${dependency.source}' containing the import kind '${dependency.importKind}' in elements of type '${file.type}'",
            rules: flatten(
              toPairs(options).map(([from, { packages }]) => adaptImports(from, packages))
            ),
          },
        ],
      },
      settings: {
        'boundaries/elements': Object.keys(options).map((type) => ({
          type,
          pattern: `${type}/**`,
          mode: 'folder',
        })),
      },
    },
  ] satisfies Linter.Config[];

function adaptImports(
  from: string | [string, Record<string, string>],
  imports: Partial<Import>[] | undefined
) {
  return imports?.map(({ name, importKind }) => {
    if (!importKind || importKind === 'all')
      return {
        from,
        allow: name,
      };

    if (Array.isArray(importKind))
      return importKind.map((importKind) => ({
        from,
        allow: name,
        importKind,
      }));

    return {
      from,
      allow: name,
      importKind,
    };
  });
}
