const express = require('express');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../lib/logger');

const users = require('../../db').users;
const validates = require('./users.validate');
const environment = require('../../environments/environment');
const nexmo = require('../lib/nexmo');
const UserNoFoundError = require('./users.error').UserNoFoundError;
const UserNoAllowedIDError = require('./users.error').UserNoAllowedIDError;
const UserLoginError = require('./users.error').UserLoginError;
const UserSMSError = require('./users.error').UserSMSError;

const usersRoutes = express.Router();

usersRoutes.get('/', (req, res) => {
  res.status(200).send(users);
  logger.info(users);
});

usersRoutes.get('/:id', (req, res) => {
  const user = users.filter(user => user.id === req.params.id)[0];
  if(!user) {
    throw new UserNoFoundError(`user with id: ${req.params.id} not found`);
  }
  res.status(200).send(user);
  logger.info(user);
});

usersRoutes.post('/', validates.validateUser, (req, res) => {
  const user = {
    ...req.body,
    id: uuidv4(),
    password: bcrypt.hashSync(req.body.password, environment.BCRYPT_SALT),
    code_sms: Math.floor((Math.random() * 1000) + 1000),
    validatedPhone: false,
  };

  const to = user.phone_number;
  const text = `Bienvenido a krowdy, tu codigo de confirmacion es: ${user.code_sms} `;
  nexmo.message.sendSms(environment.NEXMO_FROM, to, text);

  users.push(user);
  logger.info(user);
  res.status(200).send({id: user.id});
});

usersRoutes.put('/:id', (req, res) => {
  if(req.body.id) {
    throw new UserNoAllowedIDError(`product with id: ${req.params.id} not found`);
  }
  const indexUserFound = users.findIndex(user => user.id === req.params.id);
  if(indexUserFound === -1) {
    throw new UserNoFoundError(`user with id: ${req.params.id} not found`);
  }
  updatedUser = { ...users[indexUserFound], ...req.body };
  users[indexUserFound] = updatedUser;
  res.status(200).send(updatedUser);
  logger.info(updatedUser);
});

usersRoutes.delete('/:id', (req, res) => {
  const indexUserFound = users.findIndex(user => user.id === req.params.id);
  if (indexUserFound === -1) {
    throw new UserNoFoundError(`user with id: ${req.params.id} not found`);
  }
  users.splice(indexUserFound, 1);
  res.status(200).send({ message: 'user deleted' });
  logger.info(users[indexUserFound]);
});

usersRoutes.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = users.filter(user => user.username === username)[0]
  if(!user) {
    throw new UserLoginError(`username incorrect`, `username: ${req.body.username}, Verify your username`);
  }

  if(!user.validatedPhone) {
    throw new UserLoginError(`confirma tu número telefonico`, `user: ${JSON.stringify(user)}, confirma tu numero telefonico`);
  }

  const isAuthenticated = bcrypt.compareSync(password, user.password);
  if(!isAuthenticated) {
    throw new UserLoginError(`Verify your password`, `login: ${req.body.username}, Verify your password`);
  }

  const token = jwt.sign({ id: user.id }, environment.SECRET_KEY, { expiresIn: environment.EXPIRES_IN })
  res.json({ token })
})

usersRoutes.post('/validate-phone-number', validates.validatePhoneNumber, (req, res) => {
  logger.info(`validate-phone-number - body: ${ JSON.stringify(req.body)}`);
  const indexUserFound = users.findIndex(user => user.id ===  req.body.id);
  if (indexUserFound === -1) {
    throw new UserNoFoundError(`user with id: ${req.body.id} not found`);
  }

  const user = users[indexUserFound];

  if(user.code_sms != req.body.code) {
    throw new UserSMSError(`code incorrect`, `username: ${user}, Verify your code`);
  }

  if(user.code_sms == req.body.code) {
    logger.error(`user: ${user}, user correct`);
    users[indexUserFound].validatedPhone = true;
    res.status(200).send({ message: `número verificado` });
    return;
  }
});

module.exports = usersRoutes;
