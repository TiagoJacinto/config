#!/usr/bin/env node
import { input } from '@inquirer/prompts';
import fs from 'fs';
import extensions from '../extensions.json';
import deepMerge from 'deepmerge';
import { map, uniq } from 'ramda';
import { isPromise } from 'util/types';
const isPromiseLike = (maybePromise) => maybePromise !== null &&
    typeof maybePromise === 'object' &&
    'then' in maybePromise &&
    typeof maybePromise.then === 'function';
function defineTryFn(transformer) {
    function tryWrapper(tryFn) {
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
        }
        catch (e) {
            return [null, transformer(e)];
        }
    }
    return tryWrapper;
}
const toError = (maybeError) => {
    if (maybeError instanceof Error)
        return maybeError;
    try {
        return new Error(JSON.stringify(maybeError));
    }
    catch {
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
    let json;
    if (fileContent.length === 0) {
        json = extensions;
    }
    else {
        const [parsed, error] = tryFn(() => JSON.parse(fileContent));
        if (error) {
            console.error(error);
            return;
        }
        json = deepMerge(extensions, parsed);
    }
    json = map(uniq, json);
    fs.writeFileSync(vscodeExtensionsFilePath, JSON.stringify(json));
})();
