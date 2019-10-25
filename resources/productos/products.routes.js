const express = require('express')
const uuidv4 = require('uuid/v4');

const validateProduct = require('./products.validate');
let products = require('../../db').products;

const productsRoutes = express.Router()

productsRoutes.get('/', (req, res) => {
  res.json(products);
});

productsRoutes.post('/', validateProduct, (req, res) => {
  const newProduct = { ...req.body, id: uuidv4() };
  products.push(newProduct);
  res.json(newProduct);
})

productsRoutes.get('/:id', (req, res) => {
  const prod = products.filter(product => product.id === req.params.id)[0];
  if(!prod) {
    res.status(404).send({ message: 'product not found' });
    return;
  }
  res.status(200).send(prod);
});

///products/098as908asd098asd089
productsRoutes.put('/:id', (req, res) => {
  if(req.body.id) {
    res.status(400).send({ message: 'not allowed send id' });
    return;
  }
  const indexProdFound = products.findIndex(product => product.id === req.params.id);
  if(indexProdFound === -1) {
    res.status(404).send({ message: 'product not found' });
    return;
  }
  updatedProduct = { ...products[indexProdFound], ...req.body };
  products[indexProdFound] = updatedProduct;
  res.status(200).send(updatedProduct);
})

// DESTROY

productsRoutes.delete('/:id', (req, res) => {
  const indexProductFound = products.findIndex(product => product.id === req.params.id);
  if (indexProductFound === -1) {
    res.status(404).send({ message: 'product not found' });
    return;
  }
  products.splice(indexProductFound, 1);
  res.status(200).send({ message: 'user deleted' });
});


module.exports = productsRoutes;
