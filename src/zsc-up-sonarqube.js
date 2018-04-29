#!/usr/bin/env node
const commander = require('commander');
const {spawn} = require('child_process');
const path = require('path');

commander
  .name('zsc-up-sonarqube')
  .description('provisions a sonarqube instance using docker')
  .option('-Pui, --host-port-ui [host-port-ui]', 'specifies the host port for the sonarqube user interface')
  .option('-Psv, --host-port-server [host-port-server]', 'specifies the host port for the sonarqube server');

commander.parse(process.argv);

const commandString = `${path.join(__dirname, '../services/sonarqube')}`;
const commandArgs = [
  commander.hostPortUi || '',
  commander.hostPortServer || '',
];

const childProc = spawn(commandString, commandArgs, {detached: true});
process.on('SIGINT', () => {
  console.log('> Received SIGINT - use `docker ps` to find the process and run `docker stop [CONTAINER ID]` to stop this process gracefully.');
});
childProc.stdout.on('data', (data) => {
  process.stdout.write(data);
});
childProc.stderr.on('data', (data) => {
  process.stderr.write(data);
});
childProc.on('exit', (exitCode) => {
  console.info(`sonarqube exited with code ${exitCode || '0'}.`);
});