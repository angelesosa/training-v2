const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const environment = require('./environments/environment');
const productsRoutes = require('./resources/productos/products.routes');
const usersRoutes = require('./resources/usuarios/users.routes');
const passport = require('./resources/lib/jwtStrategy');

const app = express();
app.use(bodyParser.json());

app.use('/products', productsRoutes);
app.use('/users', usersRoutes);

/************************** */
// READ
app.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).send('Hola papu');
});

// CREATE
app.post('/', (req, res) => {
  console.log(req.body);
  res.json(req.body);
})

// UPDATE
app.put('/', () => {})

// DESTROY
app.delete('/', () => {})

// CRUD
// Create
// Read
// Update
// Destroy

app.listen(environment.PORT, () => {
  console.log(`Nuestra app esta escuchando el puerto ${environment.PORT}`);
});