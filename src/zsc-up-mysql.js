#!/usr/bin/env node
const commander = require('commander');
const {spawn} = require('child_process');
const path = require('path');

commander
  .name('zsc-up-mysql')
  .description('provisions a mysql instance using docker')
  .option('-P, --host-port [host-port]', 'specifies the host port for applicable instances')
  .option('-u, --username [username]',  'specifies the username for applicable instances')
  .option('-p, --password [password]',  'specifies the password for applicable instances');

commander.parse(process.argv);

const commandString = `${path.join(__dirname, '../services/mysql')}`;
const commandArgs = [
  commander.username || '',
  commander.password || '',
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
  console.info(`mysql exited with code ${exitCode || '0'}.`);
});