const chalk = require('chalk');
const pino = require('pino');

const colours = {
  'trace':  chalk.grey,
  'debug': chalk.blue,
  'info': chalk.green,
  'warn': chalk.yellow,
  'error': chalk.red,
  'fatal': chalk.bgRed,
};

const prettyLogger = pino.pretty({
  forceColor: true,
  levelFirst: true,
});
prettyLogger.pipe(process.stdout);
const logger = pino({
  name: 'zsc',
  safe: true,
  slowtime: false,
}, prettyLogger);

module.exports = logger;
