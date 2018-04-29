#!/usr/bin/env node
const commander = require('commander');

commander
  .name('zsc-npm')
  .description('npm related operations')
  .command('version', 'manipulates the version of the current package')
  .alias('v')
  .parse(process.argv);
