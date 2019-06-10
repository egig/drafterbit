class Cache {

    /**
     *
     * Class contsructor
     *
     * @param driver Object
     */
    constructor(driver) {
        this.driver = driver;
    }

    /**
     * Get cache value by key
     *
     * @param key
     * @returns {*|Promise.<String>}
     */
    get(key) {
        return this.driver.get(key);
    }

    /**
     *
     * @param key
     * @param value
     * @param options
     * @returns {*|Promise.<String>}
     */
    set(key, value, options = {}) {

        return this.driver.set(key, value, options);
    }

    /**
     *
     * @param key
     * @returns {*|Promise.<String>}
     */
    del(key){
        return this.driver.del(key);
    }

    /**
     *
     * @param pattern
     * @returns {*}
     */
    delWithPattern(pattern) {
        return this.driver.delWithPattern(pattern);
    }
}

module.exports = Cache