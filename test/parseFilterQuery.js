let chai = require('chai');
let should = chai.should();
let expect = chai.expect;

const {parseFilterQuery, stringifyFilterQuery} = require('../src/parseFilterQuery');

describe("parseFilterQuery", () => {

    describe("parseFilterQuery.parseFilterQuery", () => {

        it("should return correct query object", () => {
            let r = parseFilterQuery('title:foo;summary:test');
            expect(r.title).to.equal('foo');
            expect(r.summary).to.equal('test');
        });

        it("should return null if no param passed", () => {
            let r = parseFilterQuery();
            expect(r).to.equal(undefined);
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
});