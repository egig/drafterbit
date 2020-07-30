const mongoose = require('mongoose');
const Schema = mongoose.Schema;

import FieldType from './FieldType';

/**
 * Converts type names into actual types supported by mongoose.
 * @param {String} type - one of 'string', 'number', 'boolean',
 *                               'date', 'buffer', 'objectid', 'mixed'
 * @throws Error
 * @return {Object}
 */
function matchType(type: string) {

    switch (type) {
    case FieldType.SHORT_TEXT:
    case FieldType.LONG_TEXT:
    case FieldType.RICH_TEXT:
        return String;

    case FieldType.NUMBER:
        return Number;
    default:
        return Schema.Types.ObjectId;
    }
}

/**
 * Converts a plain json schema definition into a mongoose schema definition.
 *
 * @param {Object} descriptor
 * @return {Object}
 */
export function convert(descriptor: any) {
    let encoded = JSON.stringify(descriptor);
    return JSON.parse(encoded, function (key, value) {

        if (key === 'type' && (typeof value !== 'object')) {
            return matchType(value);
        }
        return value;
    });
};

/**
 * Get Schema from fields
 *
 * @param fields
 * @returns {any}
 */
export function getSchema(fields: any[]) {
    let fieldsObj: any = {};
    let primitiveTypes = FieldType.fieldTypes.map(t => {
        return t.id;
    });

    fields.forEach(f => {

        if (primitiveTypes.indexOf(f.type_name) !== -1) {
            fieldsObj[f.name] = {
                type: f.type_name,
                unique: f.unique,
                index: f.index ? f.index : f.unique
            };
        } else {
            if (f.multiple) {
                fieldsObj[f.name] = [{
                    type: f.type_name,
                    ref: f.type_name
                }];
            } else {
                fieldsObj[f.name] = {
                    type: f.type_name,
                    ref: f.type_name
                };
            }
        }
    });

    return convert(fieldsObj);
}