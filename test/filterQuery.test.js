let chai = require('chai');
let should = chai.should();
let expect = chai.expect;

const {parseFilterQuery, stringifyFilterQuery, mergeFilterObj} = require('../src/filterQuery');

describe("parseFilterQuery", () => {

    describe("parseFilterQuery.parseFilterQuery", () => {

        it("should return correct query object", () => {
            let r = parseFilterQuery('title:foo;summary:test');
            expect(r.title).to.equal('foo');
            expect(r.summary).to.equal('test');
        });

        it("should return null if no param passed", () => {
            let r = parseFilterQuery();
            expect(r).to.be.an('object');
        });
    });

    describe("parseFilterQuery.stringifyFilterQuery", () => {

        it("should return correct query string", () => {
            let r = stringifyFilterQuery({
                "title": "foo",
                "summary": "test",
            });

            expect(r).to.have.string('title:foo');
            expect(r).to.have.string('summary:test');
        });
    });

    describe("parseFilterQuery.mergeFilterObject", () => {

        it("should return correct merged object", () => {
            let r = mergeFilterObj({
                "title": "foo",
                "summary": "test",
            }, {
                "summary": "test2",
                "bar": "baz"
            });

            expect(r.summary).to.be.a("array");
            expect(r.title).to.be.a("string");
            expect(r.bar).to.eq("baz");
        });
    });

});