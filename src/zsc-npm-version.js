#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs');
const path = require('path');
const semver = require('semver');

commander
  .name('zsc-npm-version')
  .description('manipulates the version of the current package')
  .option('-p, --patch', 'performs a patch version bump')
  .option('-m, --minor', 'performs a minor version bump')
  .option('-M, --major', 'performs a major version bump');

commander
  .parse(process.argv);

let versionBumpType;
if (commander.minor === true) {
  versionBumpType = 'minor';
} else if (commander.major === true) {
  versionBumpType = 'major';
} else {
  versionBumpType = 'patch';
}

const pathToPackageJson = path.join(process.cwd(), './package.json');
if (!fs.existsSync(pathToPackageJson)) {
  console.error(`${pathToPackageJson} could not be found. Aborting.`);
  process.exit(1);
} else {
  const packageJson = require(pathToPackageJson);
  const {version} = packageJson;
  const nextVersion = semver.inc(version, versionBumpType);
  const nextPackageJson = Object.assign(packageJson, {version: nextVersion});
  try {
    fs.writeFileSync(pathToPackageJson, JSON.stringify(nextPackageJson, null, 2));
    console.info(`Updated version from ${version} to ${nextVersion}`);
    process.exit(0);
  } catch (ex) {
    console.error(ex);
    process.exit(1);
  }
}