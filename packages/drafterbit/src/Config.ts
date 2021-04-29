import path from 'path';

const DRAFTERBIT_ENV_PREFIX = "DRAFTERBIT_";

class Config {

    private _defaults: any = {};

    /**
     *
     * @param defaults
     */
    constructor(defaults: Object = {}) {
        this._defaults = defaults;
    }

    /**
     *
     * @param key
     * @param fallback
     */
    get(key: string, fallback?: any) {
        return (this._defaults as any)[key] || fallback;
    }

    /**
     *
     * @param defaults
     */
    registerConfig(defaults: Object) {
        this._defaults = Object.assign({}, this._defaults, defaults);
    }

    /**
     *
     * @param dir
     */
    load(dir: string) {
        require('dotenv').config({ path: path.join(dir,'.env') });

        for (let k of Object.keys(process.env)){
            if (k.toUpperCase().startsWith(DRAFTERBIT_ENV_PREFIX)) {
                let reg = new RegExp(`^${DRAFTERBIT_ENV_PREFIX}`);
                let configKey  = k.replace(reg, "").toLowerCase();
                this._defaults[configKey] = process.env[k];
            }
        }
    }
}

export default Config