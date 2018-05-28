const {kebab} = require('case');

module.exports = DockerCommand;

function DockerCommand({
  command = null,
  container = null,
  image = null,
} = {}) {
  this.command = 'docker';
  this.args = [];
  this.imageId = image;
  this.containerName = container;
  return this;
};

DockerCommand.prototype.toString = function({
  pretty = false
} = {}) {
  return `${this.command} ${this.args.reduce((existing, curr) => {
    if (pretty && (typeof curr === 'string') && (curr.indexOf('-') === 0)) {
      return existing += `\n  ${curr} `;
    }
    return existing += `${curr} `;
  }, '')}`.trim() + (pretty ? '\n' : ' ') + this.imageId;
};

DockerCommand.prototype.container = function(containerName) {
  this.containerName = containerName;
  return this;
};

DockerCommand.prototype.flag = function(flagName, flagValue) {
  this.args.push(flagName.length > 1 ? `--${kebab(flagName)}` : `-${flagName}`);
  this.args.push(flagValue);
  return this;
};

DockerCommand.prototype.image = function(imagePath, imageTag) {
  this.imageId = `${imagePath}:${imageTag}`;
  return this;
};

DockerCommand.prototype.exec = function(command) {
  if (!this.containerName) {
    throw new Error('exec() requires container name to be set (use .container(:name))');
  }
  const {exec} = require('child_process');
  return exec(
    `${this.command} exec ${this.containerName} ${command}`
  );
};

DockerCommand.prototype.stop = function() {
  if (!this.containerName) {
    throw new Error('stop() requires container name to be set (use .container(:name))');
  }
  const {spawn} = require('child_process');
  return spawn(
    this.command,
    ['stop'].concat(this.args).concat(this.containerName),
    {detached: true}
  );
};

DockerCommand.prototype.removeContainer = function() {
  if (!this.containerName) {
    throw new Error('removeContainer() requires container name to be set (use .container(:name))');
  }
  const {spawn} = require('child_process');
  return spawn(
    this.command,
    ['rm'].concat(this.args).concat(this.containerName),
    {detached: true}
  );
};

DockerCommand.prototype.run = function(command = '') {
  if (!this.imageId) {
    throw new Error('run() requires an image to be set (use .image(:name, :tag))');
  }
  const commandArguments = ['run'].concat(this.args).concat(this.imageId);
  if (command) {
    commandArguments.push(command);
  }
  console.log(this.command + commandArguments.reduce((p, c) => p += ` ${c}`, ''));
  const {spawn} = require('child_process');
  return spawn(
    this.command,
    commandArguments,
    {detached: true}
  );
};
