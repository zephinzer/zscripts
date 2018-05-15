const commander = require('commander');

const utils = require('./utils');
const {log} = utils;

commander
  .name('zsc version next')
  .description('retrieves the next version according to the git tags')
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

if (
  commander.rawArgs.indexOf('-h') !== -1
  || commander.rawArgs.indexOf('--help') !== -1
) {
  commander.help();
} else {
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
}