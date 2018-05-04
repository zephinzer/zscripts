const commander = require('commander');

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

utils.versioning.list()
  .then((tags) => {
    if (tags.length === 0) {
      log.error('this repository has not yet been initialised for versioning using git tags, use "zsc version init" to do so');
      process.exit(1);
    } else {
      const latestVersion = tags[0];
      const nextVersion = utils.versioning.next({
        currentVersion: latestVersion,
        options: commander
      });
      log.info(`bumping from version ${latestVersion}...`);
      return utils.versioning.create(nextVersion);
    }
  })
  .then((version) => {
    log.info(`repository now at version ${version}`);
  })
  .catch((error) => {
    log.fatal(error);
    log.error(`exiting with code ${error.exitCode}`);
    process.exit(error.exitCode);
  });
