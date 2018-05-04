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
      log.info(`doing a pre-release version bump (alpha)...`);
      nextVersion = increment('prerelease', 'alpha');
    } else if (options.beta === true) {
      log.info(`doing a pre-release version bump (beta)...`);
      nextVersion = increment('prerelease', 'beta');
    } else if (options.releaseCandidate === true) {
      log.info(`doing a pre-release version bump (rc)...`);
      nextVersion = increment('prerelease', 'rc');
    } else if (typeof options.preRelease === 'string') {
      log.info(`doing a pre-release version bump (${options.preRelease})...`);
      nextVersion = increment('prerelease', preRelease);
    } else {
      log.error('-r/--pre-release tag should be accompanied by either a string tag name (eg: zsc version bump -r stringTag) or any of the following flags (in order of precedence): -a (alpha), -b (beta), or -c (release-candidate) tags (eg: zsc version bump {-ra,-rb,-rc})');
      process.exit(1);
    }
  } else  if (options.preMajor) {
    log.info('doing a pre-major version bump...');
    nextVersion = increment('premajor', options.preMajor ? options.preMajor : undefined);
  } else if (options.major === true) {
    log.info('doing a major version bump...');
    nextVersion = increment('major');
  } else if (options.preMinor) {
    log.info('doing a pre-minor version bump...');
    nextVersion = increment('preminor', options.preMinor ? options.preMinor : undefined);
  } else if (options.minor === true) {
    log.info('doing a minor version bump...');
    nextVersion = increment('minor');
  } else if (options.prePatch) {
    log.info('doing a pre-patch version bump...');
    nextVersion = increment('prepatch', options.prePatch ? options.prePatch : undefined);
  } else {
    log.info('doing a patch version bump...');
    nextVersion = increment('patch');
  }
  return nextVersion;
};
