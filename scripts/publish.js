const fs = require("fs");
const { execSync } = require("child_process");
const { input, select } = require("@inquirer/prompts");

/** @typedef {{name: string, version: string, scripts?:Record<string,string>}} PackageJson */
/** @typedef {{cwd: string, currentVersion:string, packageJsonPath: string, packageJson: PackageJson}} PackagesConfiguration */

const askForCommitMessage = () =>
	input({
		message: "Enter the commit message:",
	});

const getPackageCwd = (/**@type {string}*/ pkg) => `./packages/${pkg}`;

const getPackageJsonPath = (/**@type {string}*/ pkg) =>
	`./packages/${pkg}/package.json`;

const getPackageJson = (/**@type {string}*/ path) =>
	/**@type {PackageJson}*/ (JSON.parse(fs.readFileSync(path, "utf-8")));

const updatePackageJson = (
	/**@type {string}*/ path,
	/**@type {PackageJson}*/ newPackageJson,
) => {
	fs.writeFileSync(path, JSON.stringify(newPackageJson, null, 2));

	console.log(`Version updated to ${newPackageJson.version}`);
};

(async () => {
	try {
		const mode = await select({
			message: "Select the mode:",
			choices: ["one"],
		});

		const packages = fs.readdirSync("./packages");

		execSync("pnpm install", { stdio: "inherit" });

		if (mode === "one") {
			const pkg = await select({
				message: "Select the package to publish:",
				choices: packages,
			});

			const packageJsonPath = getPackageJsonPath(pkg);
			const packageJson = getPackageJson(packageJsonPath);

			const cwd = getPackageCwd(pkg);

			execSync("pnpm install", { stdio: "inherit", cwd });

			if (packageJson.scripts) {
				if ("build" in packageJson.scripts)
					execSync("pnpm run build", { stdio: "inherit", cwd });
				if ("test" in packageJson.scripts)
					execSync("pnpm run test", { stdio: "inherit", cwd });
			}

			console.log("Current version: ", packageJson.version);
			const version = await input({ message: "Enter the new version:" });

			updatePackageJson(packageJsonPath, { ...packageJson, version });

			execSync("npm publish", { stdio: "inherit", cwd });

			execSync("git add .", { stdio: "inherit", cwd });

			const commitMessage = await askForCommitMessage();

			execSync(
				`git commit -m "publish package ${pkg} with version ${version} | ${commitMessage}"`,
				{
					stdio: "inherit",
					cwd,
				},
			);
		}

		execSync("git push -u origin main", {
			stdio: "inherit",
		});

		console.log("Commit pushed to origin main");
	} catch (e) {
		const error = /**@type {Error}*/ (e);
		console.error("An error occurred:", error.message);
	}
})();
