const path = require('path');
// const fs = require('fs');
// const nconf = require('nconf');

class Config {
    constructor(ROOT, defaults) {
        require('dotenv').config({ path: path.join(ROOT,'.env') });
        this.defaults = defaults
    }

    get(key) {
        if (key in process.env) {
            return process.env[key]
        }
        return this.defaults[key]
    }

    registerConfig(defaults) {
        this.defaults = Object.assign({}, this.defaults, defaults)
    }
}

function createConfig(ROOT) {
    const defaultConfig = {
        'APP_NAME': 'Unnamed App',
        'DEBUG': false,
        'NODE_ENV': 'production',
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

    return new Config(ROOT, defaultConfig)

    //
    // if (typeof options == 'string' && fs.existsSync(options)) {
    //     options = require(options);
    // }
    //
    // let config = Object.assign({}, defaultConfig, options);
    //
    // nconf
    //     .env([
    //         'APP_NAME',
    //         'PORT',
    //         'SESSION_SECRET',
    //         'NODE_ENV',
    //         'MONGODB_URL',
    //         'MONGODB_PATH',
    //         'MONGODB_NAME',
    //         'MONGODB_HOST',
    //         'MONGODB_PORT',
    //         'MONGODB_USER',
    //         'MONGODB_PASS',
    //     ])
    //     .defaults(config);
    //
    // return nconf;
}


module.exports = createConfig;
