const path = require('path');
const fs = require('fs');
const { ERR_NO_CONFIG_FILE } = require('./constants');

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

function createConfig(options) {

    let configFileName = 'config.js';

    if (typeof options === 'string') {
        let rootDir = options;
        let configFile = `${options}/${configFileName}`;
        if (fs.existsSync(configFile)) {
            options = require(configFile);
        } else {
            options = {}
        }
        options['ROOT_DIR'] = rootDir
    }

    const defaults = {
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

    let config = Object.assign({}, defaults, options);
    return new Config(options["ROOT_DIR"], config)
}


module.exports = createConfig;
