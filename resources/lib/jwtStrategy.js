const passport = require('passport');
const authJWT = require('passport-jwt');
const logger = require('../lib/logger');

const environment = require('../../environments/environment');

const jwtOptions = {
  secretOrKey: environment.SECRET_KEY,
  jwtFromRequest: authJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}

let jwtStrategy = new authJWT.Strategy({ ...jwtOptions },(jwtPayload, next) => {
  // usuarioDelPayLoad
  logger.info(`jwtPayload -> ${jwtPayload}`);
  next(null, {
    id: jwtPayload.id
  });
})
passport.use(jwtStrategy);

module.exports = passport