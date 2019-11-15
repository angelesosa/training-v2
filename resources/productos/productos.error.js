class ProductError extends Error {
  constructor(status, name, message, messageDefault, logdetails) {
    super(message);
    this.message = message || messageDefault;
    this.status = status;
    this.name = name;
    this.logdetails = logdetails;
  }
}

class ProductoNoFoundError extends ProductError {
  constructor(message) {
    super(404, 'ProductoNoFoundError', message, 'Producto no existe. No complited');
  }
}

class ProductoNoAllowedIDError extends ProductError {
  constructor(message) {
    super(400, 'ProductoNoAllowedIDError', message, 'not allowed send id');
  }
}

class ProductoUrlPresignedError extends ProductError {
  constructor(message, logdetails = '') {
    super(400, 'ProductoUrlPresignedError', message, 'Error getting presigned url from AWS S3', logdetails);
  }
}


module.exports = {
  ProductoNoFoundError,
  ProductoUrlPresignedError,
  ProductoNoAllowedIDError,
}