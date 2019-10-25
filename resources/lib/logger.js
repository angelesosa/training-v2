const winston = require('winston');
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: 'info',
      json: false,
      handleExceptions: true,
      maxSize: 512000,
      maxFiles: 5,
      filename: `${__dirname}/../logs/log-de-aplicacion.log`,
      prettyPrint: object => { return JSON.stringify(object) }
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
      prettyPrint: object => { return JSON.stringify(object) }
    })
  ]
})

module.exports = logger;