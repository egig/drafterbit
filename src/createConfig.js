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
        'appName': "Unnamed App",
        'debug': true,
        'PORT': 3000,
        'SESSION_SECRET': 'secr3t',
        'MONGODB_PROTOCOL': 'mongodb+srv',
        'MONGODB_URL': '',
        'MONGODB_NAME': '',
        'MONGODB_HOST': '',
        'MONGODB_PORT': '',
        'MONGODB_USER': '',
        'MONGODB_PASS': '',
        'ADMIN_API_KEY': 'test',
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
            'MONGODB_URL',
            'MONGODB_PATH',
            'MONGODB_NAME',
            'MONGODB_HOST',
            'MONGODB_PORT',
            'MONGODB_USER',
            'MONGODB_PASS',
            'ADMIN_API_KEY',
        ])
        .defaults(config);

    return nconf;
}


module.exports = createConfig;
