const fs = require('fs');
const path = require('path');

const {kebab, snake} = require('case');
const inquirer = require('inquirer');
const yaml = require('yamljs');

const DockerCommand = require('./docker-command');

const utils = {};

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
      } catch (ex) { console.error(ex.message); }
    }
  }
  try {
    fs.rmdirSync(dataVolumePath);
    if (notRoot === false) {
      console.info(`${dataVolumePath} was cleared.`);
    }
  } catch (ex) {
    console.error(ex.message);
    if (notRoot === false) {
      switch (ex.code) {
        case 'ENOTEMPTY':
          console.warn('* you may need to manually run the following to remove the data:');
          console.warn(`sudo rm -rf ${dataVolumePath}`);
          break;
      }
    }
  }
  
};

utils.createDataVolume = (dataVolumePath) => {
  try {
    fs.mkdirSync(dataVolumePath);
    console.info(`${dataVolumePath} was created.`);
  } catch (ex) {
    switch (ex.code) {
      case 'EEXIST': console.warn(`${dataVolumePath} already exists.`); break;
      default: console.error(ex);
    }
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

utils.provisionChildProcess = ({
  childProcessHandle,
  containerName,
  beforeStopHook,
  onExitHook,
} = {}) => {
  utils.provisionGracefulContainerShutdown({containerName, beforeStopHook});
  childProcessHandle.stdout.on('data', (data) => {
    process.stdout.write(data);
  });
  childProcessHandle.stderr.on('data', (data) => {
    process.stderr.write(data);
  });
  childProcessHandle.on('exit', (exitCode) => {
    console.info(`service exited with code ${exitCode || '0'}.`);
    console.info(`removing container ${containerName}...`);
    utils.createDockerCommand()
      .container(containerName)
      .removeContainer()
      .on('exit', () => {
        console.info(`container ${containerName} was removed.`);
        onExitHook(exitCode);
        process.exit(exitCode);
      });
  });
};

utils.provisionGracefulContainerShutdown = ({
  containerName,
  beforeStopHook
} = {}) => {
  let handled = false;
  process.on('SIGINT', () => {
    console.info('received SIGINT - shutting down instance gracefully...');
    if (handled === false) {
      handled = true;
      console.info(`stopping container ${containerName}...`);
      if (typeof beforeStopHook === 'function') {
        beforeStopHook().then(() => {
          setTimeout(() => {
            utils.createDockerCommand().container(containerName).stop().on('exit', () => {
              console.info(`container ${containerName} has stopped.`);
            });
          }, 5000);
        })
      } else {
        utils.createDockerCommand().container(containerName).stop().on('exit', () => {
          console.info(`container ${containerName} has stopped.`);
        });
      }
    } else {
      console.info('already processing SIGINT - wait...');
    }
  });
};

utils.setIfString = (supposedValue, defaultValue = '') => {
  return (typeof supposedValue === 'string') ? supposedValue : defaultValue;
};
