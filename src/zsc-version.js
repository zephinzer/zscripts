#!/usr/bin/env node
const commander = require('commander');
const path = require('path');

const utils = require('./utils');

commander
  .name('zsc version')
  .description('versioning related operations using git')
  .command('current', 'retrieves the current version according to the git tags')
  .alias('c')
  .command('next', 'retrieves the next version according to the git tags')
  .alias('n')
  .command('init', 'initializes the versioning at 0.0.0')
  .alias('i')
  .command('bump', 'bumps the current version')
  .alias('b')
  .action((command) => {
    utils.handleCommand(commander, command);
  })
  .parse(process.argv);
