const fs = require('fs');
const { execSync } = require('child_process');
const { input, checkbox } = require('@inquirer/prompts');

(async () => {
  const packages = await checkbox({
    message: 'Select the packages to publish:',
    choices: ['typescript', 'eslint'],
  });

  const commitMessage = await input({ message: 'Enter the commit message:' });

  const packagesConfiguration = {};

  for (const package of packages) {
    const cwd = `./packages/${package}`;
    const packageJsonPath = `${cwd}/package.json`;
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    console.log(`Configure package: ${package}`);
    console.log('Current version: ', packageJson.version);
    const version = await input({ message: 'Enter the new version:' });

    packagesConfiguration[package] = {
      cwd,
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

  for (const package of packages) {
    const { cwd, packageJsonPath, newPackageJson } = packagesConfiguration[package];

    try {
      fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson, null, 2));
      console.log(`Version updated to ${version}`);

      execSync('npm publish', { stdio: 'inherit', cwd });

      execSync('git add .', { stdio: 'inherit', cwd });
    } catch (error) {
      console.error('An error occurred:', error.message);
    }

    console.log('----------------------------------------------------------');
  }

  execSync(
    `git commit -m "publish packages [${packages.join(', ')}] | ${commitMessage}" ${Object.entries(
      packagesConfiguration
    )
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
  execSync('git push -u origin main', {
    stdio: 'inherit',
    cwd,
  });

  console.log('Commit pushed to origin main');
})();
