class UserError extends Error {
  constructor(status, name, message, messageDefault, logdetails) {
    super(message);
    this.message = message || messageDefault;
    this.status = status;
    this.name = name;
    this.logdetails = logdetails;
  }
}

class UserNoFoundError extends UserError {
  constructor(message) {
    super(404, 'UserNoFoundError', message, 'Producto no existe. No complited');
  }
}

class UserNoAllowedIDError extends UserError {
  constructor(message) {
    super(400, 'UserNoAllowedIDError', message, 'not allowed send id');
  }
}

class UserLoginError extends UserError {
  constructor(message, logdetails) {
    super(401, 'UserLoginError', message, 'credentials error', logdetails);
  }
}

class UserSMSError extends UserError {
  constructor(message, logdetails) {
    super(404, 'UserSMSError', message, 'credentials error', logdetails);
  }
}

module.exports = {
  UserNoFoundError,
  UserNoAllowedIDError,
  UserLoginError,
  UserSMSError,
}