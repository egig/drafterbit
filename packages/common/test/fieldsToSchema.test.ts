// @ts-ignore
const chai = require('chai');
const mongoose = require('mongoose');
const should = chai.should();
const expect = chai.expect;
const Schema = mongoose.Schema;

import { convert } from '../src/fieldsToSchema';
import FieldType from '../src/FieldType';

describe('fieldsToSchema', () => {

    it('should convert text to string', () => {
        let schema = convert({
            title: {
                type: FieldType.SHORT_TEXT
            }
        });
        expect(schema.title.type).to.equal(String);
    });

    it('should convert relation to mongoose objectId', () => {
        let schema = convert({
            title: {
                type: 'UnknownPrimitiveType'
            }
        });
        expect(schema.title.type).to.equal(Schema.Types.ObjectId);
    });

});