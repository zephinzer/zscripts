const commander = require('commander');
const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');
const semver = require('semver');

const utils = require('./utils');
const {log} = utils;

commander
  .name('zsc-version-bumps')
  .description('bumps the current version to the next')
  .option('-a, --alpha', 'does an alpha release (applicable only for pre-release version bumps)')
  .option('-b, --beta', 'does a beta release (applicable only for pre-release version bumps)')
  .option('-c, --release-candidate', 'does a release candidate release (applicable only for pre-release version bumps)')
  .option('-r, --pre-release', 'performs a pre-release version bump')
  .option('-o, --pre-patch [pre-patch-id]', 'performs a pre-patch version bump')
  .option('-p, --patch', 'performs a patch version bump')
  .option('-l, --pre-minor [pre-minor-id]', 'performs a pre-minor version bump')
  .option('-m, --minor', 'performs a minor version bump')
  .option('-L, --pre-major [pre-major-id]', 'performs a pre-major version bump')
  .option('-M, --major', 'performs a major version bump')
  .parse(process.argv);

let allTags = '';
const childProcess = exec('git tag --list');
childProcess.stdout.on('data', (data) => {
  allTags += data;
});
childProcess.on('exit', () => {
  const tags = allTags.trim().split('\n').map((val) => {
    if(semver.valid(val)) {
      return val;
    }
  });
  if (tags.length === 0) {
    log.error('this repository has not yet been initialised for versioning using git tags, use "zsc version init" to do so');
    process.exit(1);
  } else {
    const sortedTags = semver.rsort(tags);
    const latestVersion = sortedTags[0];
    const increment = semver.inc.bind(null, latestVersion);
    let nextVersion;
    if (commander.preRelease) {
      if (commander.alpha === true) {
        nextVersion = increment('prerelease', 'alpha');
      } else if (commander.beta === true) {
        nextVersion = increment('prerelease', 'beta');
      } else if (commander.releaseCandidate === true) {
        nextVersion = increment('prerelease', 'rc');
      } else if (typeof commander.preRelease === 'string') {
        nextVersion = increment('prerelease', commander.preRelease);
      } else {
        log.error('-r/--pre-release tag should be accompanied by either a string tag name (eg: zsc version bump -r stringTag) or any of the following flags (in order of precedence): -a (alpha), -b (beta), or -c (release-candidate) tags (eg: zsc version bump {-ra,-rb,-rc})');
        process.exit(1);
      }
    } else  if (commander.preMajor) {
      nextVersion = increment('premajor', commander.preMajor ? commander.preMajor : undefined);
    } else if (commander.major === true) {
      nextVersion = increment('major');
    } else if (commander.preMinor) {
      nextVersion = increment('preminor', commander.preMinor ? commander.preMinor : undefined);
    } else if (commander.minor === true) {
      nextVersion = increment('minor');
    } else if (commander.prePatch) {
      nextVersion = increment('prepatch', commander.prePatch ? commander.prePatch : undefined);
    } else {
      nextVersion = increment('patch');
    }
    log.info(`PENDING: ${latestVersion} -> ${nextVersion}`);
    const tagProcess = exec(`git tag ${nextVersion}`);
    let tagProcessError = '';
    tagProcess.stderr.on('data', (data) => {
      tagProcessError += data;
    });
    tagProcess.on('exit', (exitCode) => {
      if (exitCode === 0) {
        log.info(`DONE:    ${latestVersion} -> ${nextVersion}`);
      } else {
        log.error('an error occurred:');
        log.error(tagProcessError);
      }
    });
  }
})