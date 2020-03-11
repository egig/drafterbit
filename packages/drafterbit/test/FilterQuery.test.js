let chai = require('chai');
let should = chai.should();
let expect = chai.expect;

const FilterQuery = require('../src/FilterQuery');

describe("FilterQuery", () => {

    let o = new FilterQuery();

    describe("FilterQuery.toString", () => {
        o.addFilter("foo", "bar");

        it("should return correct string", () => {
            expect(o.toString()).to.eq('foo:bar');
        });
    });

    describe("FilterQuery.pop", () => {
        let m = new FilterQuery();
        m.addFilter("foo", "bar");
        m.pop();

        it("should return correct filters after pop", () => {
            expect(m.getFilters().length).to.eq(0);
        });
    });

});