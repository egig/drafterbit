const expect = require('chai').expect;
const sinon = require('sinon');
const Cache = require('../../src/lib/cache/Cache');

describe('Cache manager', function () {

	it('should utilize driver to do set, get and delete', function () {

			const spyDriver = {
				get: sinon.spy(),
				set: sinon.spy(),
				del: sinon.spy(),
				delWithPattern: sinon.spy(),
			};

			let cacheManager = new Cache(spyDriver);
			cacheManager.get('foo');
			cacheManager.set('foo', 'bar');
			cacheManager.del('foo');
			cacheManager.delWithPattern('*foo*');

			expect(spyDriver.get.calledOnce).to.be.equal(true);
			expect(spyDriver.set.calledOnce).to.be.equal(true);
			expect(spyDriver.del.calledOnce).to.be.equal(true);
			expect(spyDriver.delWithPattern.calledOnce).to.be.equal(true);

		});

});