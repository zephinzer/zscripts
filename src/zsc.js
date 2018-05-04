#!/usr/bin/env node
const commander = require('commander');
const path = require('path');

const utils = require('./utils');

commander
  .name('zsc')
  .description('zscripts - convenience scripts for easing development efforts')
  .command('up', 'provisions an instance of a service using docker')
  .command('npm', 'npm related operations')
  .command('version', 'versioning related operations using git')
  .alias('v')
  .command('publish', 'repository publishing related operations')
  .alias('pub')
  .action(() => {
    utils.createDirectoryIfNotExist(path.join(`${process.env['HOME']}`, '/.zscripts'));
  })
  .parse(process.argv);