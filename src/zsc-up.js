#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs');
const path = require('path');

const utils = require('./utils');

commander
  .name('zsc up')
  .description('ups an instance of a service using docker')
  .command('mysql', 'starts a mysql instance')
  .command('redis', 'starts a redis instance')
  .command('sonarqube', 'starts a sonarqube instance')
  .command('prometheus', 'starts a prometheus instance')
  .command('vault', 'starts a vault instance')
  .action((command) => {
    utils.handleCommand(commander, command);
    utils.createDirectoryIfNotExist(path.join(`${process.env['HOME']}`, '/.zscripts/data'));
  })
  .parse(process.argv);
