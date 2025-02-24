const fs = require('fs');
const { execSync } = require('child_process');
const { input, checkbox, select } = require('@inquirer/prompts');

/** @typedef {{name: string, version: string}} PackageJson */
/** @typedef {{cwd: string, currentVersion:string, newVersion: string, packageJsonPath: string, currentPackageJson: PackageJson, newPackageJson: PackageJson}} PackagesConfiguration */

const askForCommitMessage = () =>
  input({
    message: 'Enter the commit message:',
  });

const getPackageCwd = (/**@type {string}*/ pkg) => `./packages/${pkg}`;

const getPackageJsonPath = (/**@type {string}*/ pkg) => `./packages/${pkg}/package.json`;

const getPackageJson = (/**@type {string}*/ path) =>
  /**@type {PackageJson}*/ (JSON.parse(fs.readFileSync(path, 'utf-8')));

const updatePackageJson = (/**@type {string}*/ path, /**@type {PackageJson}*/ newPackageJson) => {
  fs.writeFileSync(path, JSON.stringify(newPackageJson, null, 2));

  console.log(`Version updated to ${newPackageJson.version}`);
};

(async () => {
  try {
    const mode = await select({
      message: 'Select the mode:',
      choices: ['one', 'multiple'],
    });

    const packages = fs.readdirSync('./packages');

    if (mode === 'one') {
      const pkg = await select({
        message: 'Select the package to publish:',
        choices: packages,
      });

      const commitMessage = await askForCommitMessage();

      const packageJsonPath = getPackageJsonPath(pkg);
      const packageJson = getPackageJson(packageJsonPath);

      console.log('Current version: ', packageJson.version);
      const version = await input({ message: 'Enter the new version:' });

      const cwd = getPackageCwd(pkg);

      updatePackageJson(packageJsonPath, { ...packageJson, version });

      execSync('npm publish', { stdio: 'inherit', cwd });

      execSync('git add .', { stdio: 'inherit', cwd });

      execSync(
        `git commit -m "publish package ${pkg} with version ${version} | ${commitMessage}"`,
        {
          stdio: 'inherit',
          cwd,
        }
      );
    }

    if (mode === 'multiple') {
      /** @type {string[]} */ const selectedPackages = await checkbox({
        message: 'Select the packages to publish:',
        choices: packages,
      });

      const commitMessage = await askForCommitMessage();

      const packagesConfiguration = /**@type {Record<string, PackagesConfiguration>}*/ ({});

      for (const pkg of selectedPackages) {
        const packageJsonPath = getPackageJsonPath(pkg);
        const packageJson = getPackageJson(packageJsonPath);

        console.log(`Configure package: ${pkg}`);
        console.log('Current version: ', packageJson.version);
        const version = await input({ message: 'Enter the new version:' });

        packagesConfiguration[pkg] = {
          cwd: getPackageCwd(pkg),
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

      for (const pkg of selectedPackages) {
        const { cwd, packageJsonPath, newPackageJson } = /**@type {PackagesConfiguration}*/ (
          packagesConfiguration[pkg]
        );

        updatePackageJson(packageJsonPath, newPackageJson);

        execSync('npm publish', { stdio: 'inherit', cwd });

        execSync('git add .', { stdio: 'inherit', cwd });

        console.log('----------------------------------------------------------');

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
    }

    execSync('git push -u origin main', {
      stdio: 'inherit',
    });

    console.log('Commit pushed to origin main');
  } catch (e) {
    const error = /**@type {Error}*/ (e);
    console.error('An error occurred:', error.message);
  }
})();
