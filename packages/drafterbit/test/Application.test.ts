// @ts-nocheck
let chai = require('chai');
let expect = chai.expect;
let path = require("path");

import Application from '../src/Application';

describe('Application', () => {

    it("can store config on constructor", () => {
        let app = new Application({
            foo: "bar"
        });
        expect(app.config.get("foo")).to.equals("bar");
    });

    it("can load config from project dir", function () {
        let app = new Application();
        app.boot(path.join(__dirname, "test-app"));
        expect(app.config.get('theme')).to.equals('test-theme');
    });

    it("can load config from env", function () {
        process.env.DRAFTERBIT_TEST_KEY = "test_val";
        let app = new Application();
        app.boot(path.join(__dirname, "test-app"));
        expect(app.config.get('test_key')).to.equals('test_val');
    });

    it("can store services", () => {
        let app = new Application();
        app.set('bar', 'baz');
        expect(app.get('bar')).to.equals('baz');
    });

    it("has cmd service by default", () => {
        let app = new Application();
        app.boot(path.join(__dirname, "test-app"));
        expect(app.get('cmd')).to.not.equals(undefined);
    });

    it("has default logger", () => {
        let app = new Application();
        app.boot(path.join(__dirname, "test-app"));
        expect(app.log.log).is.a("function");
    })

});