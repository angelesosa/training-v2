const express = require('express');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../lib/logger');

const users = require('../../db').users;
const validates = require('./users.validate');
const environment = require('../../environments/environment');
const nexmo = require('../lib/nexmo');

const usersRoutes = express.Router();

usersRoutes.get('/', (req, res) => {
  res.status(200).send(users);
  logger.info(users);
});

usersRoutes.get('/:id', (req, res) => {
  const user = users.filter(user => user.id === req.params.id)[0];
  if(!user) {
    res.status(404).send({ message: 'user not found' });
    logger.error(`id: ${req.params.id}, user not found`);
    return;
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
    res.status(400).send({ message: 'not allowed send id' });
    logger.error(`id: ${req.body.id}, not allowed send id`);
    return;
  }
  const indexUserFound = users.findIndex(user => user.id === req.params.id);
  if(indexUserFound === -1) {
    res.status(404).send({ message: 'user not found' });
    logger.error(`id: ${req.params.id}, user not found`);
    return;
  }
  updatedUser = { ...users[indexUserFound], ...req.body };
  users[indexUserFound] = updatedUser;
  res.status(200).send(updatedUser);
  logger.info(updatedUser);
});

usersRoutes.delete('/:id', (req, res) => {
  const indexUserFound = users.findIndex(user => user.id === req.params.id);
  if (indexUserFound === -1) {
    res.status(404).send({ message: 'user not found' });
    logger.error(`id: ${req.params.id}, user not found`);
    return;
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
    res.status(404).send({ message: 'username incorrect' });
    logger.error(`username: ${req.body.username}, Verify your username`);
    return;
  }

  if(!user.validatedPhone) {
    logger.error(`user: ${JSON.stringify(user)}, confirma tu numero telefonico`);
    res.status(404).send({ message: 'confirma tu número telefonico' });
    return;
  }

  const isAuthenticated = bcrypt.compareSync(password, user.password);
  if(!isAuthenticated) {
    res.status(404).send({ message: 'Verify your password' });
    logger.error(`username: ${req.body.username}, username incorrect`);
    return;
  }

  if (isAuthenticated) {
    // CREAR UN JWT
    const token = jwt.sign({ id: user.id }, environment.SECRET_KEY, { expiresIn: environment.EXPIRES_IN })
    res.json({ token })
  } else {
    res.status(401).send('Verify your password');
  }
})

usersRoutes.post('/validate-phone-number', validates.validatePhoneNumber, (req, res) => {
  logger.info(`validate-phone-number - body: ${ JSON.stringify(req.body)}`);
  const indexUserFound = users.findIndex(user => user.id ===  req.body.id);
  if (indexUserFound === -1) {
    res.status(404).send({ message: 'user not found' });
    logger.error(`id: ${req.params.id}, user not found`);
    return;
  }

  const user = users[indexUserFound];

  if(user.code_sms != req.body.code) {
    logger.error(`username: ${user}, Verify your code`);
    res.status(404).send({ message: 'code incorrect' });
    return;
  }

  if(user.code_sms == req.body.code) {
    logger.error(`user: ${user}, user correct`);
    users[indexUserFound].validatedPhone = true;
    res.status(200).send({ message: `número verificado` });
    return;
  }
});

module.exports = usersRoutes;
