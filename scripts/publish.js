const fs = require('fs');
const { execSync } = require('child_process');
const { input, select } = require('@inquirer/prompts');

(async () => {
  const package = await select({
    message: 'Select the package to publish: ',
    choices: ['typescript', 'eslint'],
  });

  const cwd = `./packages/${package}`;

  const packageJsonPath = `${cwd}/package.json`;
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  console.log('Current version: ', packageJson.version);

  const version = await input({ message: 'Enter the new version: ' });
  const commitMessage = await input({ message: 'Enter the commit message: ' });

  try {
    packageJson.version = version;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`Version updated to ${version}`);

    execSync('npm publish', { stdio: 'inherit', cwd });

    execSync('git add .', { stdio: 'inherit', cwd });
    execSync(
      `git commit -m "publish package ${package} with version ${version} | ${commitMessage}"`,
      {
        stdio: 'inherit',
        cwd,
      }
    );
    execSync('git push -u origin main', {
      stdio: 'inherit',
      cwd,
    });
    console.log('Commit pushed to origin main');
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
})();
