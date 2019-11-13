const nconf = require('nconf');

/**
 *
 * @param options
 * @return {Provider}
 */
function createConfig(options) {

    const defaultConfig = {
        'appName': 'Unnamed App',
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
        ])
        .defaults(config);

    return nconf;
}


module.exports = createConfig;
