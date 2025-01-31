const fs = require('fs');
const { execSync } = require('child_process');
const { input, checkbox, select } = require('@inquirer/prompts');

(async () => {
  try {
    const mode = await select({
      message: 'Select the mode:',
      choices: ['one', 'multiple'],
    });

    const packages = fs.readdirSync('./packages');

    if (mode === 'one') {
      const package = await select({
        message: 'Select the package to publish:',
        choices: packages,
      });

      const commitMessage = await askForCommitMessage();

      const packageJsonPath = getPackageJsonPath(package);
      const packageJson = getPackageJson(packageJsonPath);

      console.log('Current version: ', packageJson.version);
      const version = await input({ message: 'Enter the new version:' });

      const cwd = getPackageCwd(package);

      updatePackageJson(packageJsonPath, { ...packageJson, version });

      execSync('npm publish', { stdio: 'inherit', cwd });

      execSync('git add .', { stdio: 'inherit', cwd });

      execSync(
        `git commit -m "publish package ${package} with version ${version} | ${commitMessage}"`,
        {
          stdio: 'inherit',
          cwd,
        }
      );
    }

    if (mode === 'multiple') {
      const selectedPackages = await checkbox({
        message: 'Select the packages to publish:',
        choices: packages,
      });

      const commitMessage = await askForCommitMessage();

      const packagesConfiguration = {};

      for (const package of selectedPackages) {
        const packageJsonPath = getPackageJsonPath(package);
        const packageJson = getPackageJson(packageJsonPath);

        console.log(`Configure package: ${package}`);
        console.log('Current version: ', packageJson.version);
        const version = await input({ message: 'Enter the new version:' });

        packagesConfiguration[package] = {
          cwd: getPackageCwd(package),
          currentVersion: packageJson.version,
          newVersion: version,
          packageJsonPath,
          currentPackageJson: packageJson,
          newPackageJson: {
            ...packageJson,
            version,
          },
        };
      }

      for (const package of selectedPackages) {
        const { cwd, packageJsonPath, newPackageJson } = packagesConfiguration[package];

        updatePackageJson(packageJsonPath, newPackageJson);

        execSync('npm publish', { stdio: 'inherit', cwd });

        execSync('git add .', { stdio: 'inherit', cwd });

        console.log('----------------------------------------------------------');
      }

      execSync(
        `git commit -m "publish packages [${selectedPackages.join(
          ', '
        )}] | ${commitMessage}" ${Object.entries(packagesConfiguration)
          .map(
            ([name, { currentVersion, newVersion }]) =>
              `-m "${name}: ${currentVersion} => ${newVersion}"`
          )
          .join(' ')}`,
        {
          stdio: 'inherit',
          cwd,
        }
      );
    }

    console.log('Changes were committed. You can push to origin using: "git push -u origin main"');
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
})();

const askForCommitMessage = () =>
  input({
    message: 'Enter the commit message:',
  });

const getPackageCwd = (package) => `./packages/${package}`;
const getPackageJsonPath = (package) => `./packages/${package}/package.json`;
const getPackageJson = (path) => JSON.parse(fs.readFileSync(path, 'utf-8'));

const updatePackageJson = (path, newPackageJson) => {
  fs.writeFileSync(path, JSON.stringify(newPackageJson, null, 2));

  console.log(`Version updated to ${newPackageJson.version}`);
};
