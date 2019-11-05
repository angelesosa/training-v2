const environment = {
  PORT: 3000,
  BCRYPT_SALT: 10,
  SECRET_KEY: 'SECRET_KEY',
  NEXMO_API_KEY: '377208f1',
  NEXMO_API_SECRET: 'OepPkd7D9CbYJVPn',
};

console.log('************** ENV *****************')
console.log('PORT', environment.PORT);
console.log('BCRYPT_SALT', environment.BCRYPT_SALT);
console.log('SECRET_KEY', environment.SECRET_KEY);
console.log('************** ENV *****************')
module.exports = environment
