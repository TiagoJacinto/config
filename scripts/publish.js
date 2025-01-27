const fs = require('fs');
const { execSync } = require('child_process');
const { input, checkbox } = require('@inquirer/prompts');

(async () => {
  const packages = await checkbox({
    message: 'Select the packages to publish: ',
    choices: ['typescript', 'eslint'],
  });

  const commitMessage = await input({ message: 'Enter the commit message: ' });

  const packagesConfiguration = {};

  for (const package of packages) {
    const cwd = `./packages/${package}`;
    const packageJsonPath = `${cwd}/package.json`;
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    console.log(`Configure package: ${package}`);
    console.log('Current version: ', packageJson.version);
    const version = await input({ message: 'Enter the new version: ' });

    packageJson.version = version;

    packagesConfiguration[package] = {
      cwd,
      packageJsonPath,
      packageJson,
    };
  }

  for (const package of packages) {
    const { cwd, packageJsonPath, packageJson } = packagesConfiguration[package];

    try {
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

    console.log('----------------------------------------------------------');
  }
})();
