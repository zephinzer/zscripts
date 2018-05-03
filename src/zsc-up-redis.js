#!/usr/bin/env node
const commander = require('commander');
const path = require('path');

const utils = require('./utils');

const {service, DEFAULT_CONTAINER_NAME, DEFAULT_USER_ID} = utils.getServiceConfiguration('redis');

commander
  .name('zsc-up-redis')
  .description('provisions a redis instance using docker')
  .option('-P, --host-port [host-port]',  'specifies the host port for accessing redis', service.port)
  .option('-l, --link [existing:in-app]', 'links containers to container being spun up', (c, x) => x.concat(c), [])
  .option('-n, --name [name]',            'specifies the name of the container', DEFAULT_CONTAINER_NAME)
  .option('-U, --user-id [user-id]',      'specifies the user ID for the redis instance', DEFAULT_USER_ID)
  .parse(process.argv);

const dataVolumePath = utils.getDataVolumePath(commander.name);
utils.createDataVolume(dataVolumePath);
const command = utils.createDockerCommand();
command
  .image(service.image, service.tag)
  .flag('volume', `${dataVolumePath}:/data:Z`)
  .flag('publish', `${commander.hostPort}:${service.port}`)
  .flag('name', commander.name)
  .flag('user', utils.getCurrentUserId());
commander.link.forEach((link) => command.flag('link', link));

const childProc = command.run();
utils.provisionChildProcess({
  childProcessHandle: childProc,
  containerName: commander.name,
  onExitHook: (exitCode) => {
    utils.clearDataVolume(dataVolumePath);
  },
});
