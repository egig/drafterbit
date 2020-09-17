import path from 'path';

class Config {

    private _defaults: Object = {};
    /**
     *
     * @param root
     * @param defaults
     */
    constructor(root: string, defaults: Object = {}) {
        require('dotenv').config({ path: path.join(root,'.env') });
        this._defaults = defaults;
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
        return (this._defaults as any)[key];
    }

    /**
     *
     * @param defaults
     */
    registerConfig(defaults: Object) {
        this._defaults = Object.assign({}, this._defaults, defaults);
    }
}

export default Config