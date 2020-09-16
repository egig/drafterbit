//@ts-ignore
let chai = require('chai');
let should = chai.should();
let expect = chai.expect;
let utils = require('../src/utils');

describe('utils', () => {

    describe('utils.slugify', () => {

        it('should return correct string', () => {
            expect(utils.slugify("Foo Bar", "-")).to.eq('foo-bar');
        });
    });

});