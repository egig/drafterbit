let chai = require('chai');
let should = chai.should();
let expect = chai.expect;

const FieldType = require('../src/FieldType');

describe("FieldType", () => {

    describe("FieldType.fieldTypes", () => {

        it("should return field types array", () => {
            expect(FieldType.fieldTypes).to.be.an('array');
        });

    });

    describe("fieldTypes.getTypeName", () => {

        it("should return correct field name", () => {
            let fieldName = FieldType.getTypeName(FieldType.SHORT_TEXT);
            expect(fieldName).to.equal('Short Text');
        });
    });

});