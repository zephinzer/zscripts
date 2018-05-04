#!/usr/bin/env node
const commander = require('commander');
const path = require('path');

const utils = require('./utils');

commander
  .name('zsc publish')
  .description('repository publishing related operations')
  .command('npm', 'commits all changes to git, bumps the version and publishes to npm')
  .action((command) => {
    utils.handleCommand(commander, command);
  })
  .parse(process.argv);
