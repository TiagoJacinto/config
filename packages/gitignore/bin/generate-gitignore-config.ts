#!/usr/bin/env node

import { input, checkbox } from '@inquirer/prompts';
import fs from 'fs';
import path from 'path';

const basePath = path.join(__dirname, '../');
const extension = '.gitignore';

(async () => {
  const configNames = fs
    .readdirSync(basePath)
    .filter((d) => d.endsWith(extension))
    .map((c) => c.replace(extension, ''));

  const selectedConfigNames = await checkbox<string>({
    message: 'Select the gitignore configs to include:',
    choices: configNames,
  });

  if (selectedConfigNames.length === 0) return;

  const config = selectedConfigNames
    .map(
      (configName) =>
        `# ${configName}\n${fs
          .readFileSync(path.join(basePath, configName + extension), 'utf-8')
          .split('\n')
          .filter((l) => l.trim() !== '')
          .join('\n')}`
    )
    .join('\n'.repeat(2));

  console.log('Config: \n');
  console.log(config);
})();
