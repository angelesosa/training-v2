const express = require('express')
const uuidv4 = require('uuid/v4');
const logger = require('../lib/logger');

const validateProduct = require('./products.validate');
const env = require('../../environments/environment');
const s3 = require('../lib/awsServer');
const procesarError = require('../lib/errorHandler').procesarError;
const ProductoUrlPresignedError = require('./productos.error').ProductoUrlPresignedError;
const ProductoNoFoundError = require('./productos.error').ProductoNoFoundError;
const ProductoNoAllowedIDError = require('./productos.error').ProductoNoAllowedIDError;
let products = require('../../db').products;

const productsRoutes = express.Router()

productsRoutes.get('/', (req, res) => {
  res.json(products);
  logger.info(products);
});

productsRoutes.post('/', validateProduct, (req, res) => {
  const newProduct = { ...req.body, id: uuidv4() };
  products.push(newProduct);
  res.json(newProduct);
  logger.info(newProduct);
})

productsRoutes.get('/generate-put-presignedurl', procesarError((req, res) => {
  var fileurls = [];
  const signedUrlExpireSeconds = 60 * 60; // 1 hora
  const myBucket = env.S3_BUCKET_NAME;
  const myKey = 'api/uploads/' + req.body.fileName;
  const params = {
    Bucket: myBucket,
    Key: myKey,
    Expires: signedUrlExpireSeconds,
  };

  s3.getSignedUrl('putObject', params, function (err, url) {
    if (err) {
      throw new ProductoUrlPresignedError(`Pre-Signed URL error`, JSON.stringify(err));
    }
    else {
      fileurls[0] = url;
      logger.info('Presigned URL: ', fileurls[0]);
      res.json({ success: true, message: 'AWS SDK S3 Pre-signed urls generated successfully.', urls: fileurls });
    }
  });
}));

productsRoutes.get('/generate-get-presignedurl', procesarError((req, res) => {
  var fileurls = [];
  const signedUrlExpireSeconds = 60 * 10; // 10 minutos
  const myBucket = env.S3_BUCKET_NAME;
  const myKey = 'api/uploads/' + req.body.fileName;
  const params = {
    Bucket: myBucket,
    Key: myKey,
    Expires: signedUrlExpireSeconds,
  };

  s3.getSignedUrl('getObject', params, function (err, url) {
    if (err) {
      throw new ProductoUrlPresignedError(`Pre-Signed URL error`, JSON.stringify(err));
    }
    else {
      fileurls[0] = url;
      logger.info('Presigned URL: ', fileurls[0]);
      res.json({ success: true, message: 'AWS SDK S3 Pre-signed urls generated successfully.', urls: fileurls });
    }
  });
}));

productsRoutes.get('/:id', procesarError((req, res) => {
  const prod = products.filter(product => product.id === req.params.id)[0];
  if(!prod) {
    throw new ProductoNoFoundError(`product with id: ${req.params.id} not found`);
  }
  res.status(200).send(prod);
  logger.info(prod);
}));

///products/098as908asd098asd089
productsRoutes.put('/:id', procesarError((req, res) => {
  if(req.body.id) {
    throw new ProductoNoAllowedIDError(`not allowed send id`);
  }
  const indexProdFound = products.findIndex(product => product.id === req.params.id);
  if(indexProdFound === -1) {
    throw new ProductoNoFoundError(`product with id: ${req.params.id} not found`);
  }
  updatedProduct = { ...products[indexProdFound], ...req.body };
  products[indexProdFound] = updatedProduct;
  res.status(200).send(updatedProduct);
  logger.info(updatedProduct);
}));

// DESTROY

productsRoutes.delete('/:id', (req, res) => {
  const indexProductFound = products.findIndex(product => product.id === req.params.id);
  if (indexProductFound === -1) {
    throw new ProductoNoFoundError(`product with id: ${req.params.id} not found`);
  }
  products.splice(indexProductFound, 1);
  res.status(200).send({ message: 'user deleted' });
  logger.info(products[indexProductFound]);
});


module.exports = productsRoutes;
