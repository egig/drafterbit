let chai = require('chai');
let should = chai.should();
let expect = chai.expect;

const createConfig = require('../src/createConfig');

describe("createConfig", () => {

    it("should load config from file", () => {
        let config = createConfig(__dirname+'/configFileTest.js');
        expect(config.get("MONGODB_NAME")).to.equal("test_db_name");
    });

});