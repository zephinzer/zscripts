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

let allTags = '';
const childProcess = exec('git tag --list');
let childProcessError = '';
childProcess.stdout.on('data', (data) => {
  allTags += data;
});
childProcess.stderr.on('data', (data) => {
  childProcessError += data;
})
childProcess.on('exit', (exitCode) => {
  if (exitCode !== 0) {
    log.error(childProcessError);
    process.exit(exitCode);
  }
  const tags = allTags.trim().split('\n').map((val) => {
    if(semver.valid(val)) {
      return val;
    }
  });
  if (!allTags || tags.length === 0) {
    log.info('initialising versioning using git at 0.0.0...');
    const tagProcess = exec(`git tag 0.0.0`);
    let tagProcessError = '';
    tagProcess.stderr.on('data', (data) => {
      tagProcessError += data;
    });
    tagProcess.on('exit', (exitCode) => {
      if (exitCode === 0) {
        log.info(`version set to 0.0.0`);
      } else {
        if (tagProcessError.indexOf('Failed to resolve \'HEAD\'') !== -1) {
          log.error('git tags cannot work without any commit. commit some code and try again.');
          process.exit(exitCode);
        }
      }
    });
  } else {
    log.info(`git versioning already initialised - current version: ${semver.rsort(tags)[0]}`);
  }
})