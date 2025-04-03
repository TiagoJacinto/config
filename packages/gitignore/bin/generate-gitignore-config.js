#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prompts_1 = require("@inquirer/prompts");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const basePath = path_1.default.join(__dirname, '../');
const extension = '.gitignore';
(async () => {
    const configNames = fs_1.default
        .readdirSync(basePath)
        .filter((d) => d.endsWith(extension))
        .map((c) => c.replace(extension, ''));
    const selectedConfigNames = await (0, prompts_1.checkbox)({
        message: 'Select the gitignore configs to include:',
        choices: configNames,
    });
    if (selectedConfigNames.length === 0)
        return;
    const config = selectedConfigNames
        .map((configName) => `# ${configName}\n${fs_1.default
        .readFileSync(path_1.default.join(basePath, configName + extension), 'utf-8')
        .split('\n')
        .filter((l) => l.trim() !== '')
        .join('\n')}`)
        .join('\n'.repeat(2));
    console.log('Config: \n');
    console.log(config);
})();
