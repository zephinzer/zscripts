#!/usr/bin/env node
const commander = require('commander');
const {exec} = require('child_process');
const path = require('path');

commander
  .name('zscript-up')
  .description('ups an instance of a service using docker')
  .command('mysql', 'starts a mysql instance')
  .command('redis', 'starts a redis instance')
  .parse(process.argv);
