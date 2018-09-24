const nconf = require('nconf');
const path = require('path');

nconf
    .env([
	  'DEBUG',
	  'PORT',
	  'SESSION_SECRET',
    'NODE_ENV',
    'PORT',
    'MYSQL_HOST',
    'MYSQL_PORT',
    'MYSQL_USER',
    'MYSQL_PASSWORD',
    'MYSQL_DB',
    'REDIS_HOST',
    'REDIS_PORT',
    'REDIS_DB',
    'REGISTERED_API_KEY_LIST',
    'IMG_BASE_URL',
    'IMG_BASE_URL',
	  'MAILJET_APIKEY_PUBLIC',
	  'MAILJET_APIKEY_PRIVATE',
	  'API_BASE_URL',
    'MONGODB_URL',
    'ADMIN_API_KEY'
    ])
    .file({ file: path.join(__dirname, '../config.json') })
    .defaults({
        PORT: 3000,
    });

module.exports = nconf;
