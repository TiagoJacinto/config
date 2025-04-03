#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = require("@inquirer/prompts");
const fs_1 = __importDefault(require("fs"));
const extensions_json_1 = __importDefault(require("../extensions.json"));
const deepmerge_1 = __importDefault(require("deepmerge"));
const ramda_1 = require("ramda");
const types_1 = require("util/types");
const isPromiseLike = (maybePromise) => maybePromise !== null &&
    typeof maybePromise === 'object' &&
    'then' in maybePromise &&
    typeof maybePromise.then === 'function';
function defineTryFn(transformer) {
    function tryWrapper(tryFn) {
        try {
            const result = tryFn();
            if ((0, types_1.isPromise)(result)) {
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
    const vscodeExtensionsFilePath = await (0, prompts_1.input)({
        message: 'Enter the path to the vscode extensions.json file:',
        default: '.vscode/extensions.json',
    });
    if (!fs_1.default.existsSync(vscodeExtensionsFilePath)) {
        fs_1.default.mkdirSync(vscodeExtensionsFilePath.slice(0, vscodeExtensionsFilePath.lastIndexOf('/')), {
            recursive: true,
        });
        fs_1.default.writeFileSync(vscodeExtensionsFilePath, JSON.stringify(extensions_json_1.default));
        return;
    }
    const fileContent = fs_1.default.readFileSync(vscodeExtensionsFilePath, 'utf-8');
    let json;
    if (fileContent.length === 0) {
        json = extensions_json_1.default;
    }
    else {
        const [parsed, error] = tryFn(() => JSON.parse(fileContent));
        if (error) {
            console.error(error);
            return;
        }
        json = (0, deepmerge_1.default)(extensions_json_1.default, parsed);
    }
    json = (0, ramda_1.map)(ramda_1.uniq, json);
    fs_1.default.writeFileSync(vscodeExtensionsFilePath, JSON.stringify(json));
})();
