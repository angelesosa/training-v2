const AWS = require('aws-sdk');

const env = require('../../environments/environment');

const s3 = new AWS.S3({
  accessKeyId: env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY, 
  useAccelerateEndpoint: true,
  region: 'us-east-2',
  signatureVersion: 'v4',
});

module.exports = s3;