// @ts-nocheck
let chai = require('chai');
let should = chai.should();
let expect = chai.expect;

import Config from '../src/Config';

describe('Config', () => {

    it('should load default', () => {

        let config = new Config({
            test_default: "bar"
        });
        expect(config.get('test_default')).to.equal('bar');
    });

    it('should load from env', () => {
        let config = new Config({});

        process.env.DRAFTERBIT_TEST_KEY = 'foo';
        config.load(__dirname);
        expect(config.get('test_key')).to.equal('foo');
    });

    it('should register config', () => {
        let config = new Config({});
        config.registerConfig({
            "plugin_config": "baz"
        });

        expect(config.get('plugin_config')).to.equal('baz');
    })

});