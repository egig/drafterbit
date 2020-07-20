const path = require('path');

export class Config {

    defaults: Object = {};
    /**
     *
     * @param root
     * @param defaults
     */
    constructor(root: string, defaults: Object = {}) {
        require('dotenv').config({ path: path.join(root,'.env') });
        this.defaults = defaults;
    }

    /**
     *
     * @param key
     * @returns {string|*}
     */
    get(key: string) {
        if (key in process.env) {
            return process.env[key];
        }
        return (this.defaults as any)[key];
    }

    /**
     *
     * @param defaults
     */
    registerConfig(defaults: Object) {
        this.defaults = Object.assign({}, this.defaults, defaults);
    }
}