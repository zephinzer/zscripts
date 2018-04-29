#!/usr/bin/env node
const commander = require('commander');

commander
  .name('zscript')
  .description('zscripts')
  .command('up', 'provisions an instance of a service using docker')
  .command('npm', 'npm related operations');

commander
  .parse(process.argv);