const express = require('express');
const uuidv4 = require('uuid/v4');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

usersRoutes.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = users.filter(user => user.username === username)[0]
  if(!user) {
    res.status(404).send({ message: 'username incorrect' });
    logger.error(`username: ${req.body.username}, Verify your username`);
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
    const token = jwt.sign({ id: user.id }, environment.SECRET_KEY, { expiresIn: '10h' })
    res.json({ token })
  } else {
    res.status(401).send('Verify your password');
  }
})

module.exports = usersRoutes;
