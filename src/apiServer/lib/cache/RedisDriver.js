const Promise = require('bluebird');
const redis = require('redis');
const redisDeletePattern = require('redis-delete-pattern');
const _ = require('lodash');

class RedisDriver {

	/**
	 * Create client constructor
	 * Options if specified, must contains followeing keys
	 *   host, port, prefix, db, ttl
	 *
	 * @param options
	 */
	constructor(options) {

		this.client = redis.createClient({
			host: options.host || 'localhost',
			port: options.port || 6379,
			password: options.auth || ''
		});

		this.prefix = options.prefix;
		this.ttl = options.ttl;
		this.dbNo = options.db || 0;
	}

	/**
	 * Get value by key
	 *
	 * @param key
	 */
	get(key) {
		let _this = this;
		return new Promise(function(fulfill, reject) {

			_this.client.select(_this.dbNo, function () {

				_this.client.get(`${_this.prefix}_${key}`, function (err, data) {

					if (err) {
						return reject(err);
					}

					if (!data) {
						return fulfill(null);
					}

					data = JSON.parse(data);

					return fulfill(data);
				});

			});
		});
	}

	/**
	 *
	 * Set a cache value
	 *
	 * @param key
	 * @param value
	 * @param options
	 */
	set(key, value, options) {

		let _this = this;

		return new Promise(function(fulfill, reject) {

			_this.client.select(_this.dbNo, function () {

				let prefixedKey = `${_this.prefix}_${key}`;
				let stringifyValue = JSON.stringify(value);

				_this.client.set(prefixedKey, stringifyValue,(err, result)=>{

					if(err) {
						return reject(err);
					}

					let ttl = _.get(options, 'ttl', _this.ttl);
					_this.client.expire(prefixedKey, ttl);
					return fulfill(null);

				});

			});

		});

	}

	/**
	 *
	 * @param key
	 */
	del(key) {
		let _this = this;
		return new Promise(function(fulfill, reject) {

			_this.client.select(_this.dbNo, function () {

				let cacheKey = `${_this.prefix}_${key}`;

				_this.client.del(cacheKey, (err, result)=>{

					if(err) {
						return reject(err);
					}

					return fulfill(null);
				});

			});

		});
	}

	/**
	 *
	 * @param pattern
	 */
	delWithPattern(pattern) {

		let _this = this;

		return new Promise(function(fulfill, reject) {

			_this.client.select(_this.dbNo, function () {

				redisDeletePattern({
					redis: _this.client,
					pattern: `${pattern}`
				}, function handleError(err) {

					if(err) {
						return reject(err);
					}

					return fulfill(null);
				});

			});

		})
	}

}

module.exports = RedisDriver;
