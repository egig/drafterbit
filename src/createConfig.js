const fs = require('fs');
const nconf = require('nconf');

/**
 *
 * @param options
 * @return {Provider}
 */
function createConfig(options = {}) {

    const defaultConfig = {
        'appName': 'Unnamed App',
        'debug': true,
        'NODE_ENV': 'development',
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
            './src/modules/file',
            './src/modules/core',
            './src/modules/user',
            './src/modules/api_key',
            './src/modules/swagger',
            './src/modules/content'
        ]
    };

    if (typeof options == 'string' && fs.existsSync(options)) {
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
