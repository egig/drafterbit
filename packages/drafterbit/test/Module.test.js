let chai = require('chai');
let expect = chai.expect;

const Module = require('../Module');

describe('Module', () => {

    it('should return relative to root', () => {
        let r = Module.resolve('./testpath.js', __dirname);
        expect(r).to.equal(__dirname+'/testpath.js');
    });

    it('should return absolute', () => {
        let r = Module.resolve('/testpath.js', __dirname);
        expect(r).to.equal('/testpath.js');
    });

    it('should return module', () => {
        let r = Module.resolve('testpath', __dirname);
        expect(r).to.equal('testpath');
    });

});