class ObjectDriver {

    /**
	 *
	 * Class constructor
	 */
    constructor() {
        this.data = {};
    }

    /**
	 * Get cache value by key
	 *
	 * @param key
	 */
    get(key) {
        let _this = this;
        return new Promise(function (resolve, reject) {

            return setTimeout(function () {
                let data  = _this.data[key];
                return resolve(data);
            }, 0);
        });
    }

    /**
	 *
	 * @param key
	 * @param value
	 * @param options
	 */
    set(key, value, options = {}) {
        let _this = this;
        return new Promise(function (resolve, reject) {

            return setTimeout(function () {
                _this.data[key] = value;
                return resolve(true);
            }, 0);
        });
    }

    /**
	 *
	 * @param key
	 * @returns {Promise}
	 */
    del(key) {
        return new Promise(function (resolve, reject) {

            let _this = this;
            setTimeout(function () {
                _this.data[key] = null;
                return resolve(true);
            }, 0);
        });
    }

    /**
	 *
	 * @param pattern
	 * @returns {Promise}
	 */
    delWithPattern(pattern) {
        throw 'Delete with pattern is not supported';
    }

}

module.exports =  ObjectDriver;