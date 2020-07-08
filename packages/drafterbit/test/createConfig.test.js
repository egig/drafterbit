let chai = require('chai');
let should = chai.should();
let expect = chai.expect;

const createConfig = require('../createConfig');

describe("createConfig", () => {

    it("should load config from file", () => {
        let config = createConfig(__dirname);
        expect(config.get("MONGODB_NAME")).to.equal("test_db_name");
    });

});