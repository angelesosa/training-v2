const environment = {
  PORT: 3000,
  BCRYPT_SALT: 10,
};

console.log('************** ENV *****************')
console.log('PORT', environment.PORT);
console.log('BCRYPT_SALT', environment.BCRYPT_SALT);
console.log('************** ENV *****************')
module.exports = environment
