#!/usr/bin/env node
const commander = require('commander');
const path = require('path');

const utils = require('./utils');

const {service, DEFAULT_CONTAINER_NAME, DEFAULT_USER_ID} = utils.getServiceConfiguration('vault');

commander
  .name('zsc up vault')
  .description('provisions a vault instance using docker')
  .option('-P, --host-port [host-port]',  'specifies the host port for accessing vault', service.port)
  .option('-l, --link [existing:in-app]', 'links containers to container being spun up', (c, x) => x.concat(c), [])
  .option('-n, --name [name]',            `specifies the name of the container`, DEFAULT_CONTAINER_NAME)
  .option('-U, --user-id [user-id]',      `specifies the user ID for the vault instance`, DEFAULT_USER_ID)
  .parse(process.argv);

const dataVolumePath = utils.getDataVolumePath(commander.name);
utils.createDataVolume(dataVolumePath);
const command = utils.createDockerCommand();
command
  .image(service.image, service.tag)
  .flag('cap-add', `IPC_LOCK`)
  .flag('volume', `${dataVolumePath}/file:/vault/file:Z`)
  .flag('volume', `${dataVolumePath}/logs:/vault/logs:Z`)
  .flag('env', 'VAULT_LOCAL_CONFIG={"backend": {"file": {"path": "/vault/file"}}, "default_lease_ttl": "168h", "max_lease_ttl": "720h"}')
  .flag('publish', `${commander.hostPort}:${service.port}`)
  .flag('user', utils.getCurrentUserId());
commander.link.forEach((link) => command.flag('link', link));

const childProc = command.run('server');
utils.provisionChildProcess({
  childProcessHandle: childProc,
  containerName: commander.name,
  onExitHook: (exitCode) => {
    utils.clearDataVolume(dataVolumePath);
  },
});
