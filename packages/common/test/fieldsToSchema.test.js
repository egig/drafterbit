const chai = require('chai');
const mongoose = require('mongoose');
const should = chai.should();
const expect = chai.expect;
const Schema = mongoose.Schema;

const { convert } = require('../fieldsToSchema');
const FieldType = require('../FieldType');

describe("fieldsToSchema", () => {

    it("should convert text to string", () => {
        let schema = convert({
            title: {
                type: FieldType.SHORT_TEXT
            }
        });
        expect(schema.title.type).to.equal(String)
    });

    it("should convert unstructured to mongoose mixed", () => {
        let schema = convert({
            title: {
                type: FieldType.UNSTRUCTURED
            }
        });
        expect(schema.title.type).to.equal(Schema.Types.Mixed)
    });

    it("should convert relation to mongoose objectId", () => {
        let schema = convert({
            title: {
                type: "UnknownPrimitiveType"
            }
        });
        expect(schema.title.type).to.equal(Schema.Types.ObjectId)
    });

});