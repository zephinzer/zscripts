const pino = require('pino');
const prettyLogger = pino.pretty({
  forceColor: true,
  levelFirst: true,
});
prettyLogger.pipe(process.stdout);
const logger = pino({
  name: 'zsc',
  safe: true,
}, prettyLogger);

module.exports = logger;
