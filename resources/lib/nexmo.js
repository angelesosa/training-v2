const Nexmo = require('nexmo');

const env = require('../../environments/environment');

const nexmo = new Nexmo({
  apiKey: env.NEXMO_API_KEY,
  apiSecret: env.NEXMO_API_SECRET,
});

module.exports = nexmo;