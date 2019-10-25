const express = require('express');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const logger = require('../lib/logger');

const users = require('../../db').users;
const validateUsers = require('./users.validate');
const environment = require('../../environments/environment');

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

usersRoutes.post('/', validateUsers, (req, res) => {
  const user = {
    ...req.body,
    id: uuidv4(),
    password: bcrypt.hashSync(req.body.password, environment.BCRYPT_SALT)
  };
  users.push(user);
  res.status(200).send(user);
  logger.info(user);
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

module.exports = usersRoutes;
