#!/usr/bin/env node

import { input } from '@inquirer/prompts';
import fs from 'fs';
import extensions from '../extensions.json';
import deepMerge from 'deepmerge';
import { map, uniq, flow } from 'ramda';
import { Promisable } from 'type-fest';
import { isPromise } from 'util/types';

const isPromiseLike = <T,>(maybePromise: Promisable<T>): maybePromise is PromiseLike<T> =>
  maybePromise !== null &&
  typeof maybePromise === 'object' &&
  'then' in maybePromise &&
  typeof maybePromise.then === 'function';

function defineTryFn<E extends object>(transformer: (e: unknown) => E) {
  function tryWrapper<T>(tryFn: () => Promise<T>): Promise<[T, null] | [null, E]>;
  function tryWrapper<T>(tryFn: () => T): [T, null] | [null, E];
  function tryWrapper<T>(tryFn: () => Promisable<T>) {
    try {
      const result = tryFn();

      if (isPromise(result)) {
        return result.then((data) => [data, null]).catch((e) => [null, transformer(e)]);
      }

      if (isPromiseLike(result)) {
        return Promise.resolve(result)
          .then((data) => [data, null])
          .catch((e) => [null, transformer(e)]);
      }

      return [result, null];
    } catch (e) {
      return [null, transformer(e)];
    }
  }

  return tryWrapper;
}

const toError = (maybeError: unknown) => {
  if (maybeError instanceof Error) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
};

const tryFn = defineTryFn(toError);

(async () => {
  const vscodeExtensionsFilePath = await input({
    message: 'Enter the path to the vscode extensions.json file:',
    default: '.vscode/extensions.json',
  });

  if (!fs.existsSync(vscodeExtensionsFilePath)) {
    fs.mkdirSync(vscodeExtensionsFilePath.slice(0, vscodeExtensionsFilePath.lastIndexOf('/')), {
      recursive: true,
    });

    fs.writeFileSync(vscodeExtensionsFilePath, JSON.stringify(extensions));
    return;
  }

  const fileContent = fs.readFileSync(vscodeExtensionsFilePath, 'utf-8');

  let json: object;

  if (fileContent.length === 0) {
    json = extensions;
  } else {
    const [parsed, error] = tryFn(() => JSON.parse(fileContent) as object);

    if (error) {
      console.error(error);
      return;
    }

    json = deepMerge(extensions, parsed);
  }

  json = map(uniq, json);

  fs.writeFileSync(vscodeExtensionsFilePath, JSON.stringify(json));
})();
