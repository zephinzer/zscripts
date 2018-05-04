const commander = require('commander');
const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');
const semver = require('semver');

const utils = require('./utils');
const {log} = utils;

commander
  .name('zsc-version-init')
  .description('initialises the current git repository to use git tags for versioning')
  .parse(process.argv);

utils.versioning.list()
  .then((tags) => {
    if (tags.length !== 0) {
      log.info(`git versioning already initialised - current version: ${semver.rsort(tags)[0]}`);
      process.exit(1);
    } else {
      log.info('initialising versioning using git at 0.0.0...');
      return utils.versioning.create('0.0.0');
    }
  })
  .then((version) => {
    log.info(`repository now at version ${version}`);
  })
  .catch((error) => {
    log.fatal(error);
    if (error.message.indexOf('Failed to resolve \'HEAD\'') !== -1) {
      log.error('git tags cannot work without any commit. commit some code and try again.');
    }
    log.error(`exiting with code ${error.exitCode}`);
    process.exit(error.exitCode); 
  });
