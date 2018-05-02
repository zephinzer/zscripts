#!/usr/bin/env node
const commander = require('commander');
const path = require('path');

const utils = require('./utils');

const {service, DEFAULT_CONTAINER_NAME, DEFAULT_USER_ID} = utils.getServiceConfiguration('sonarqube');

commander
  .name('zsc-up-sonarqube')
  .description('provisions a sonarqube instance using docker')
  .option('-Pui, --host-port-ui [host-port-ui]',  'specifies the host port for accessing sonarqube', service.port.ui)
  .option('-Pdb, --host-port-db [host-port-db]',  'specifies the host port for accessing sonarqube\'s database', service.port.db)
  .option('-l, --link [existing:in-app]', 'links containers to container being spun up', (c, x) => x.concat(c), [])
  .option('-n, --name [name]',            `specifies the name of the container`, DEFAULT_CONTAINER_NAME)
  .option('-U, --user-id [user-id]',      `specifies the user ID for the sonarqube instance`, DEFAULT_USER_ID)
  .parse(process.argv);

const dataVolumePath = utils.getDataVolumePath(commander.name);
utils.createDataVolume(dataVolumePath);
const command = utils.createDockerCommand();
command
  .image(service.image, service.tag)
  .flag('volume', `${dataVolumePath}/data:/opt/sonarqube/data:Z`)
  .flag('volume', `${dataVolumePath}/extensions:/opt/sonarqube/extensions:Z`)
  .flag('publish', `${commander.hostPortUi}:${service.port.ui}`)
  .flag('publish', `${commander.hostPortDb}:${service.port.db}`)
  .flag('name', commander.name)
  .flag('user', 0);
commander.link.forEach((link) => command.flag('link', link));

const childProc = command.run();
utils.provisionChildProcess({
  childProcessHandle: childProc,
  containerName: commander.name,
  beforeStopHook: () => {
    return new Promise((resolve, reject) => {
      utils.createDockerCommand().container(commander.name)
        .exec(`chown ${utils.getCurrentUserId()}:${utils.getCurrentUserId()} -R /opt/sonarqube`)
        .on('exit', resolve);
    });
  },
  onExitHook: (exitCode) => {
    utils.clearDataVolume(dataVolumePath);
  },
});
