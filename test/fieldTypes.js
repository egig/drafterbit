let chai = require('chai');
let should = chai.should();
let expect = chai.expect;

const { getFieldTypes, getFieldTypeName, FIELD_SHORT_TEXT } = require('../src/fieldTypes');

describe("fieldTypes", () => {

    describe("fieldTypes.getFieldTypes", () => {

        it("should return field types array", () => {
            let fieldTypes = getFieldTypes();
            expect(fieldTypes).to.be.an('array');
        });

    });

    describe("fieldTypes.getFieldTypeName", () => {

        it("should return correct field name", () => {
            let fieldName = getFieldTypeName(FIELD_SHORT_TEXT);
            expect(fieldName).to.equal('Short Text');
        });
    });

});