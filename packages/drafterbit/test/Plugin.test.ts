let chai = require('chai');
let expect = chai.expect;

import Plugin from '../src/Plugin';

describe('Module', () => {

    it('should return relative to root', () => {
        let r = Plugin.resolve('./testpath.js', __dirname);
        expect(r).to.equal(__dirname+'/testpath.js');
    });

    it('should return absolute', () => {
        let r = Plugin.resolve('/testpath.js', __dirname);
        expect(r).to.equal('/testpath.js');
    });

    it('should return module', () => {
        let r = Plugin.resolve('testpath', __dirname);
        expect(r).to.equal('testpath');
    });

});