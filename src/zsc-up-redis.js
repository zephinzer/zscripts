#!/usr/bin/env node
const commander = require('commander');
const {exec} = require('child_process');
const path = require('path');

commander
  .name('zsc-up-redis')
  .description('provisions a redis instance using docker')
  .option('-P, --host-port [host-port]', 'specifies the host port to map redis to');

commander.parse(process.argv);

const commandString =
  `${path.join(__dirname, '../services/redis')} ` +
  `"${commander.hostPort || ''}"`;

const childProc = exec(commandString);
process.on('SIGINT', () => {
  console.log('Received SIGINT.');
  childProc.kill('SIGINT');
});
childProc.stdout.on('data', (data) => {
  process.stdout.write(data);
});
childProc.stderr.on('data', (data) => {
  process.stderr.write(data);
});
childProc.on('exit', (exitCode) => {
  console.info(`Redis exited with code ${exitCode || '0'}.`);
});