import prepare from '../src/prepare';
import * as fs from 'fs-extra';
let chai = require('chai');
let assert = chai.assert;

describe("prepare()", function () {

    it("error if current directory is not empty", () => {
        assert.throws(() => { prepare(null, __dirname, undefined) },
            Error, `Directory ${__dirname} is not empty !`);
    });

    it("create directory if its not exists", () => {
        let dir =  prepare(null, __dirname, "dist")
        assert(dir ==`${__dirname}/dist`, 'should return dest')
        assert(fs.existsSync(dir), 'should created the dir')

        fs.remove(dir);
    })

})