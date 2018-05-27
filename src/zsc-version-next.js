const commander = require('commander');

const utils = require('./utils');
const {log} = utils;

commander
  .name('zsc version next')
  .description('retrieves the next version according to the git tags');
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
        process.stdout.write(nextVersion);
      }
    })
    .catch((error) => {
      log.fatal(error);
      log.error(`exiting with code ${error.exitCode}`);
      process.exit(error.exitCode);
    }); 
});
