let chai = require('chai');
let should = chai.should();
let expect = chai.expect;

const resolveModule = require('../src/resolveModule');

describe("resolveModule", () => {

    it("should return relative to root", () => {
        let root = __dirname;
        let r = resolveModule('./testpath.js', root);
        expect(r.isRelative).to.equal(true);
        expect(r.resolvedPath).to.equal(__dirname+'/testpath.js');
    });

    it("should return absolute", () => {
        let root = __dirname;
        let r = resolveModule('/testpath.js', root);
        expect(r.isAbsolute).to.equal(true);
        expect(r.resolvedPath).to.equal('/testpath.js');
    });

    it("should return module", () => {
        let root = __dirname;
        let r = resolveModule('testpath', root);
        expect(r.resolvedPath).to.equal('testpath');
    });

});