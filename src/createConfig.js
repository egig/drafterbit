const path = require('path');
const nconf = require('nconf');
const admin = require('./modules/admin');
const content = require('./modules/content');

/**
 *
 * @param options
 * @return {Provider}
 */
function createConfig(options) {

    const defaultConfig = {
        'debug': true,
        'PORT': 3000,
        'SESSION_SECRET': 'secr3t',
        'REDIS_HOST': 'localhost',
        'REDIS_PORT': 6379,
        'REDIS_DB': 0,
        'MONGODB_PROTOCOL': 'mongodb+srv',
        'MONGODB_URL': '',
        'MONGODB_HOST': '',
        'MONGODB_PORT': '',
        'MONGODB_USER': '',
        'MONGODB_PASS': '',
        'ADMIN_API_KEY': 'test',
        'project_id': 'localhost',
        'modules': [
            './src/modules/admin',
            './src/modules/content',
        ]
    };

    if (typeof options == 'string') {
        options = require(options);
    }

    let config = Object.assign({}, defaultConfig, options);

    nconf
        .env([
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
            'MONGODB_PATH',
            'MONGODB_HOST',
            'MONGODB_PORT',
            'MONGODB_USER',
            'MONGODB_PASS',
            'ADMIN_API_KEY',
            'BASIC_AUTH_USER',
            'BASIC_AUTH_PASS',
            'project_id',
            'modules'
        ])
        .defaults(config);

    return nconf;
}


module.exports = createConfig;
