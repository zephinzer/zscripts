#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs');
const path = require('path');

commander
  .name('zscript-up')
  .description('ups an instance of a service using docker')
  .command('mysql', 'starts a mysql instance')
  .command('redis', 'starts a redis instance')
  .command('sonarqube', 'starts a sonarqube instance')
  .command('prometheus', 'starts a prometheus instance')
  .action((x, y) => {
    try {
      fs.mkdirSync(path.join(`${process.env['HOME']}`, '/.zscripts'));
    } catch (ex) {
      switch (ex.code) {
        case 'EEXIST': break;
        default: console.error(ex.code);
      }
    }
    try {
      fs.mkdirSync(path.join(`${process.env['HOME']}`, '/.zscripts/data'));
    } catch (ex) {
      switch (ex.code) {
        case 'EEXIST': break;
        default: console.error(ex.code);
      }
    }
  })
  .parse(process.argv)
