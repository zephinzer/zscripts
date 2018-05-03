#!/usr/bin/env node
const commander = require('commander');

const utils = require('./utils');

commander
  .name('zsc-npm')
  .description('npm related operations')
  .command('version', 'manipulates the version of the current package')
  .alias('v')
  .action((command) => {
    utils.handleCommand(commander, command);
  })
  .parse(process.argv);
