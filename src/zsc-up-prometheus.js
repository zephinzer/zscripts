#!/usr/bin/env node
const commander = require('commander');
const path = require('path');

const utils = require('./utils');

const {service, DEFAULT_CONTAINER_NAME, DEFAULT_USER_ID} = utils.getServiceConfiguration('prometheus');

commander
  .name('zsc-up-prometheus')
  .description('provisions a prometheus instance using docker')
  .option('-c, --config-file-path [config-file-path]', 'specifies the absolute location of the config file')
  .option('-P, --host-port [host-port]',               'specifies the host port for accessing prometheus', service.port)
  .option('-l, --link [existing:in-app]',              'links containers to container being spun up', (c, x) => x.concat(c), [])
  .option('-n, --name [name]',                         'specifies the name of the container', DEFAULT_CONTAINER_NAME)
  .option('-U, --user-id [user-id]',                   'specifies the user ID for the prometheus instance', DEFAULT_USER_ID)
  .parse(process.argv);

const dataVolumePath = utils.getDataVolumePath(commander.name);
utils.createDataVolume(dataVolumePath);
const command = utils.createDockerCommand();
command
  .image(service.image, service.tag)
  .flag('volume', `${dataVolumePath}:/prometheus:Z`)
  .flag('publish', `${commander.hostPort}:${service.port}`)
  .flag('name', commander.name)
  .flag('user', utils.getCurrentUserId());
if (typeof commander.configFilePath === 'string') {
  command.flag('volume', `${commander.configFilePath}:/etc/prometheus/prometheus.yml`);
}
commander.link.forEach((link) => command.flag('link', link));

const childProc = command.run();
utils.provisionChildProcess({
  childProcessHandle: childProc,
  containerName: commander.name,
  onExitHook: (exitCode) => {
    utils.clearDataVolume(dataVolumePath);
  },
});
