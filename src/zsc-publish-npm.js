#!/usr/bin/env node
const {exec} = require('child_process');
const fs = require('fs');
const path = require('path');

const commander = require('commander');
const inquirer = require('inquirer');

const utils = require('./utils');
const {log} = utils;

commander
  .name('zsc publish npm')
  .description('publishes to npm using the git tag version as the package version')
  .option('-p, --private', 'set this flag to release the package in private mode')
  .parse(process.argv);

utils.versioning.list()
  .then((tags) => {
    const version = tags[0];
    const packageJsonPath = path.join(process.cwd(), '/package.json');
    const packageJson = require(packageJsonPath);
    const tmpPackageJson = Object.assign({...packageJson}, {version});
    log.info(`setting version property of package.json to ${version}...`);
    fs.writeFileSync(packageJsonPath, JSON.stringify(tmpPackageJson, null, 2));
    const publisher = (commander.private === true) ?
      exec('npm publish --access public')
      : exec('npm publish');
    publisher.stdout.on('data', (data) => { process.stdout.write(data); });
    publisher.stderr.on('data', (data) => { process.stderr.write(data); });
    publisher.on('exit', (exitCode) => {
      log.info('restoring package.json...');
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      process.exit(exitCode);
    });
  });
