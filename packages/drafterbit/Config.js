const path = require('path');

class Config {
    constructor(ROOT, defaults = {}) {
        require('dotenv').config({ path: path.join(ROOT,'.env') });
        this.defaults = defaults;
    }

    get(key) {
        if (key in process.env) {
            return process.env[key];
        }
        return this.defaults[key];
    }

    registerConfig(defaults) {
        this.defaults = Object.assign({}, this.defaults, defaults);
    }
}


module.exports = Config;
