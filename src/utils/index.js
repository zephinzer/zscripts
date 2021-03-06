const fs = require('fs');
const path = require('path');

const {kebab, snake} = require('case');
const chalk = require('chalk');
const yaml = require('yamljs');

const DockerCommand = require('./docker-command');

const utils = {};
const log = require('./logger');
const versioning = require('./versioning');
utils.log = log;
utils.versioning = versioning;

module.exports = utils;

utils.clearDataVolume = (dataVolumePath, notRoot = false) => {
  const ls = fs.readdirSync(dataVolumePath);
  for (let f = 0; f < ls.length; ++f) {
    const ff = path.join(dataVolumePath, `/${ls[f]}`);
    if (fs.statSync(ff).isDirectory()) {
      utils.clearDataVolume(ff, true);
    } else {
      try {
        fs.unlinkSync(ff);
      } catch (ex) {
        log.error(ex.message);
      }
    }
  }
  try {
    fs.rmdirSync(dataVolumePath);
    if (notRoot === false) {
      log.info(`${dataVolumePath} was cleared.`);
    }
  } catch (ex) {
    log.error(ex.message);
    if (notRoot === false && ex.code === 'ENOTEMPTY') {
      log.warn('* you may need to manually run the following to remove the data:');
      log.warn(`sudo rm -rf ${dataVolumePath}`);
    }
  }
  
};

utils.createDataVolume = (dataVolumePath) => {
  try {
    fs.mkdirSync(dataVolumePath);
    log.info(`${dataVolumePath} was created.`);
  } catch (ex) {
    switch (ex.code) {
      case 'EEXIST':
        log.warn(`${dataVolumePath} already exists.`);
        break;
      default: log.error(ex);
    }
  }
};

utils.createDirectoryIfNotExist = (directoryPath, directoryPurpose = '') => {
  if (!fs.existsSync(directoryPath)) {
    log.info(`provisioning ${directoryPurpose + ' '}directory at "${directoryPath}"...`);
    try { fs.mkdirSync(directoryPath); }
    catch (ex) { log.error(ex.code); }
  }
};

utils.createDockerCommand = () => {
  return new DockerCommand();
};

utils.getCurrentUserId = () => process.geteuid();

utils.getContainerName = (serviceName, serviceTag) => {
  return `zsc_${serviceName}_${snake(serviceTag)}`;
};

utils.getDataVolumePath = (containerName) => {
  return path.join(
    process.env['HOME'],
    '/.zscripts/data/',
    snake(containerName)
  );
};

utils.getServiceConfiguration = (serviceId) => {
  const configFilePath = path.join(__dirname, '../config/service/', `${serviceId}.yaml`);
  if (!fs.existsSync(configFilePath)) {
    throw new Error(`Unable to open configuration file at "${configFilePath}"`);
  }
  const config = yaml.load(configFilePath);
  return {
    service: config,
    DEFAULT_CONTAINER_NAME: snake(utils.getContainerName(config.image, config.tag)),
    DEFAULT_USER_ID: utils.getCurrentUserId(),
  };
};

utils.handleCommand = (commander, command) => {
  const commands = commander.commands.map((_command) => _command.name());
  const aliases = commander.commands.map((_command) => _command.alias());
  aliases.forEach((alias) => {
    if (alias !== undefined) {
      commands.push(alias);
    }
  });
  if (commands.indexOf(command) === -1) {
    commander.help();
    process.exit(0);
  }
};

utils.printHelpIfRequired = (commanderInstance, callback) => {
  if (
    commanderInstance.rawArgs.indexOf('-h') !== -1
    || commanderInstance.rawArgs.indexOf('--help') !== -1
  ) {
    commanderInstance.help();
  } else {
    callback();
  }
};

utils.provisionChildProcessOutputStreams = (childProcessHandle) => {
  childProcessHandle.stdout.on('data', (data) => {
    process.stdout.write(chalk.green(data.toString()));
  });
  childProcessHandle.stderr.on('data', (data) => {
    process.stderr.write(chalk.red(data.toString()));
  });
};

utils.provisionChildProcessContainerCleanup = ({
  childProcessHandle,
  containerName,
  onExitHook
}) => {
  childProcessHandle.on('exit', (exitCode) => {
    log.info(`service exited with code ${exitCode || '0'}.`);
    log.info(`removing container ${containerName}...`);
    utils.createDockerCommand()
      .container(containerName)
      .removeContainer()
      .on('exit', () => {
        log.info(`container ${containerName} was removed.`);
        onExitHook(exitCode);
        process.exit(exitCode);
      });
  });
};

utils.provisionChildProcess = ({
  childProcessHandle,
  containerName,
  beforeStopHook,
  onExitHook,
} = {}) => {
  utils.provisionGracefulContainerShutdown({containerName, beforeStopHook});
  utils.provisionChildProcessOutputStreams(childProcessHandle);
  utils.provisionChildProcessContainerCleanup({
    childProcessHandle,
    containerName,
    onExitHook
  });
};

utils.provisionGracefulContainerShutdown = ({
  containerName,
  beforeStopHook
} = {}) => {
  let handled = false;
  log.info('creating custom SIGINT handler...');
  process.on('SIGINT', () => {
    if (handled === false) {
      handled = true;
      log.info('received SIGINT - shutting down instance gracefully...');
      log.info(`stopping container ${containerName}...`);
      if (typeof beforeStopHook === 'function') {
        beforeStopHook().then(() => {
          utils.stopContainer(containerName);
        })
      } else {
        utils.stopContainer(containerName);
      }
    }
  });
};

utils.setIfString = (supposedValue, defaultValue = '') => {
  return (typeof supposedValue === 'string') ? supposedValue : defaultValue;
};

utils.stopContainer = (containerName) => {
  utils.createDockerCommand().container(containerName).stop().on('exit', () => {
    log.info(`container ${containerName} has stopped.`);
  });
};
