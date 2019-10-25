const Joi = require('@hapi/joi')
const logger = require('../lib/logger');

const usersSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  nickname: Joi.string().min(3).max(20).required(),
  password: Joi.string().min(5).max(15).required(),
  username: Joi.string().min(5).max(100).required(),
});

const validateUser = (req, res, next) => {
  const validation = usersSchema.validate(req.body);
  if (validation.error) {
    logger.error(`validation errors: ->${validation.error}`);
    return res.status(400).send('Verify')
  }
  next()
}


module.exports = validateUser;