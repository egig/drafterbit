const path = require('path');
const nconf = require('nconf');

/**
 *
 * @param configFile
 * @return {Provider}
 */
function getConfig(configFile) {
    nconf
        .env([
            'DEBUG',
            'PORT',
            'SESSION_SECRET',
            'NODE_ENV',
            'PORT',
            'REDIS_HOST',
            'REDIS_PORT',
            'REDIS_DB',
            'REGISTERED_API_KEY_LIST',
            'IMG_BASE_URL',
            'MAILJET_APIKEY_PUBLIC',
            'MAILJET_APIKEY_PRIVATE',
            'API_BASE_URL',
            'MONGODB_URL',
            'MONGODB_HOST',
            'MONGODB_PORT',
            'MONGODB_USER',
            'MONGODB_PASS',
            'ADMIN_API_KEY',
            'BASIC_AUTH_USER',
            'BASIC_AUTH_PASS'
        ])
        .file({ file: configFile})
        .defaults({
            PORT: 3000,
        });

    return nconf;
}


module.exports = getConfig;
