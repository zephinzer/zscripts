#!/usr/bin/env node
const commander = require('commander');
const {spawn} = require('child_process');
const path = require('path');

commander
  .name('zsc-up-redis')
  .description('provisions a redis instance using docker')
  .option('-P, --host-port [host-port]', 'specifies the host port to map redis to');

commander.parse(process.argv);

const commandString = `${path.join(__dirname, '../services/redis')}`;
const commandArgs = [
  commander.hostPort || '',
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
  console.info(`redis exited with code ${exitCode || '0'}.`);
});