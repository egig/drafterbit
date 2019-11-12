const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);


const drafterbit = require('../src/index')();
const { ERRNOROOTDIR } = require('../src/constants');

describe("drafterbit", () => {

    describe("drafterbit.boot", () => {

        it("need ROOT_DIR ifneed ROOT_DIR if config is not file config is not file", () => {
            function testThrow() {
                drafterbit.boot({});
            }
            expect(testThrow).to.throw(ERRNOROOTDIR);
        });

    });

    describe("drafterbit.start", () => {

        let server;
        after(() => {
            server.close();
        });

        it("should call listen", () => {
            let listen = sinon.spy(drafterbit, 'listen');
            drafterbit.boot({
                debug: false,
                ROOT_DIR: __dirname,
                modules: []
            });
            server = drafterbit.start();

            expect(listen.calledOnce).to.be.true;
        });

    });

});