const commander = require('commander');

const utils = require('./utils');
const {log} = utils;

commander
  .name('zsc version current')
  .description('retrieves the current version according to the git tags')
  .parse(process.argv);

utils.printHelpIfRequired(commander, () => {
  utils.versioning.list()
    .then((tags) => {
      process.stdout.write(tags[0]);
    })
    .catch((error) => {
      log.fatal(error);
      log.error(`exiting with code ${error.exitCode}`);
      process.exit(error.exitCode);
    });
});
