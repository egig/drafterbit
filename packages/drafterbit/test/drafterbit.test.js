const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const drafterbit = require('../drafterbit');
chai.should();
chai.use(sinonChai);


const app = new drafterbit();
const { ERRNOROOTDIR } = require('../constants');

describe("drafterbit", () => {

    describe("drafterbit.boot", () => {

        it("need ROOT_DIR ifneed ROOT_DIR if config is not file config is not file", () => {
            function testThrow() {
                app.boot({});
            }
            expect(testThrow).to.throw(ERRNOROOTDIR);
        });

    });

});