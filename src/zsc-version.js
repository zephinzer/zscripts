const commander = require('commander');
const path = require('path');

const utils = require('./utils');
const {log} = utils;

commander
  .name('zsc-version')
  .description('versioning related operations using git')
  .command('init', 'initializes the versioning at 0.0.0')
  .command('bump', 'bumps the current version')
  .parse(process.argv);
