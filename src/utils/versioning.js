const {exec} = require('child_process');

const semver = require('semver');

const log = require('./logger');

const versioning = {};

module.exports = versioning;

versioning.create = (version) => {
  let errors = '';
  const childProcess = exec(`git tag ${version}`);
  return new Promise((resolve, reject) => {
    childProcess.stderr.on('data', (data) => {
      errors += data;
    });
    childProcess.on('exit', (exitCode) => {
      if (exitCode !== 0) {
        reject(Object.assign(new Error(errors.trim()), {exitCode}));
      } else {
        resolve(version);
      }
    });
  });
};

versioning.list = () => {
  let gitTags = '';
  let errors = '';
  const childProcess = exec('git tag --list');
  return new Promise((resolve, reject) => {
    childProcess.stdout.on('data', (data) => {
      gitTags += data;
    });
    childProcess.stderr.on('data', (data) => {
      errors += data;
    })
    childProcess.on('exit', (exitCode) => {
      if (exitCode !== 0) {
        reject(Object.assign(new Error(errors.trim()), {exitCode}));
      } else {
        resolve(semver.rsort(
          gitTags
            .trim()
            .split('\n')
            .reduce((curr, val) =>
              (semver.valid(val)) ? curr.concat(val) : curr
            , [])
        ));
      }
    });
  });
};

versioning.next = ({
  currentVersion,
  options = {
    preRelease,
    alpha,
    beta,
    releaseCandidate,
    preMajor,
    major,
    preMinor,
    minor,
    prePatch,
  } = {},
}) => {
  let nextVersion;
  const increment = semver.inc.bind(null, currentVersion);
  if (options.preRelease) {
    if (options.alpha === true) {
      nextVersion = increment('prerelease', 'alpha');
    } else if (options.beta === true) {
      nextVersion = increment('prerelease', 'beta');
    } else if (options.releaseCandidate === true) {
      nextVersion = increment('prerelease', 'rc');
    } else if (typeof options.preRelease === 'string') {
      nextVersion = increment('prerelease', preRelease);
    } else {
      log.error('-r/--pre-release tag should be accompanied by either a string tag name (eg: zsc version bump -r stringTag) or any of the following flags (in order of precedence): -a (alpha), -b (beta), or -c (release-candidate) tags (eg: zsc version bump {-ra,-rb,-rc})');
      process.exit(1);
    }
  } else  if (options.preMajor) {
    nextVersion = increment('premajor', options.preMajor ? options.preMajor : undefined);
  } else if (options.major === true) {
    nextVersion = increment('major');
  } else if (options.preMinor) {
    nextVersion = increment('preminor', options.preMinor ? options.preMinor : undefined);
  } else if (options.minor === true) {
    nextVersion = increment('minor');
  } else if (options.prePatch) {
    nextVersion = increment('prepatch', options.prePatch ? options.prePatch : undefined);
  } else {
    nextVersion = increment('patch');
  }
  return nextVersion;
};

versioning.applyOptions = (commanderInstance) =>
  commanderInstance
  .option('-a, --alpha', 'does an alpha release (applicable only for pre-release version bumps)')
  .option('-b, --beta', 'does a beta release (applicable only for pre-release version bumps)')
  .option('-c, --release-candidate', 'does a release candidate release (applicable only for pre-release version bumps)')
  .option('-r, --pre-release', 'performs a pre-release version bump')
  .option('-o, --pre-patch [pre-patch-id]', 'performs a pre-patch version bump')
  .option('-p, --patch', 'performs a patch version bump')
  .option('-l, --pre-minor [pre-minor-id]', 'performs a pre-minor version bump')
  .option('-m, --minor', 'performs a minor version bump')
  .option('-L, --pre-major [pre-major-id]', 'performs a pre-major version bump')
  .option('-M, --major', 'performs a major version bump');
