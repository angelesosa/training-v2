const environment = {
  PORT: 3000,
  BCRYPT_SALT: 10,
  SECRET_KEY: 'SECRET_KEY',
  EXPIRES_IN: '10h',
  NEXMO_API_KEY: '377208f1',
  NEXMO_API_SECRET: 'OepPkd7D9CbYJVPn',
};

console.log('************** ENV *****************')
for (const key of Object.keys(environment)) {
  console.log(key, environment[key]);
}
console.log('************** ENV *****************')
module.exports = environment
