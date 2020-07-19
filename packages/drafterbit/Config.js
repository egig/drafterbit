const path = require('path');

class Config {

    /**
     *
     * @param root
     * @param defaults
     */
    constructor(root, defaults = {}) {
        require('dotenv').config({ path: path.join(root,'.env') });
        this.defaults = defaults;
    }

    /**
     *
     * @param key
     * @returns {string|*}
     */
    get(key) {
        if (key in process.env) {
            return process.env[key];
        }
        return this.defaults[key];
    }

    /**
     *
     * @param defaults
     */
    registerConfig(defaults) {
        this.defaults = Object.assign({}, this.defaults, defaults);
    }
}


module.exports = Config;
