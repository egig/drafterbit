const expect = require('chai').expect;
const RedisDriver = require('../../src/lib/cache/RedisDriver');
const config = require('../../config');

let createRedisDriver = function () {
	return new RedisDriver({
		host: config.get("REDIS_HOST"),
		port: config.get("REDIS_PORT"),
		db: config.get("REDIS_DB"),
	});
};

describe('Redis Driver', function () {

	it('should get and set cache', function () {

		let redisDriver = createRedisDriver();

		return redisDriver.set('foo', 'bar').then(function () {

				return redisDriver.get('foo');

		}).then(function (result) {
			expect(result).to.be.equal('bar');
			expect(result).to.not.equal('anything else');
			expect(result).to.not.equal(null);

		});

	});

	it('should delete cache', function () {

		let redisDriver = createRedisDriver();
		return redisDriver.del('foo').then(function () {

			return redisDriver.get('foo');

		}).then(function (result) {

			expect(result).to.be.equal(null);
			expect(result).to.not.equal('bar');

		});
	});

	it('should set and get again', function () {

		let redisDriver = createRedisDriver();

		return redisDriver.set('foo_bar_baz', 'foo_bar_baz_value').then(function () {

			return redisDriver.get('foo_bar_baz');

		}).then(function (result) {

			expect(result).to.be.equal('foo_bar_baz_value');

		});

	});

	it('should delete cache by pattern', function () {

		let redisDriver = createRedisDriver();

		return redisDriver.delWithPattern('*bar*').then(function () {

			return redisDriver.get('foo_bar_baz');

		}).then(function (result) {

			expect(result).to.be.equal(null);
			expect(result).to.not.equal('foo_bar_baz_value');

		});
	});

});