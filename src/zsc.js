#!/usr/bin/env node
const commander = require('commander');

commander
  .name('zscript')
  .description('zscripts')
  .command('up', 'provisions an instance of a service using docker');

commander
  .parse(process.argv);