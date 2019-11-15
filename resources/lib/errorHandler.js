const logger = require('./logger');

// TODO: Investigar que es un closure, y un HOC

function procesarError(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  }
}

function catchResolver(err, req, res, next) {
  console.log('********************************************');
  console.log('[ERROR - CONSOLE] =>', err);
  console.log('********************************************');
  logger.error(`${err.name} - ${err.message} => ${err.logdetails || 'no details error'}`);
  res.setHeader('Content-Type', 'application/json');
  res.status(err.status).send({message: `${err.message}`});
}

module.exports = {
  procesarError,
  catchResolver,
}
