const commander = require('commander');

const utils = require('./utils');
const {log} = utils;

commander
  .name('zsc-version-bumps')
  .description('bumps the current version to the next');
utils.versioning.applyOptions(commander);
commander.parse(process.argv);

utils.printHelpIfRequired(commander, () => {
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
});
