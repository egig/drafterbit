const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FieldType = require('./FieldType');

/**
 * Converts type names into actual types supported by mongoose.
 * @param {String} type - one of 'string', 'number', 'boolean',
 *                               'date', 'buffer', 'objectid', 'mixed'
 * @throws Error
 * @return {Object}
 */
function matchType(type) {

    switch (type) {
    case FieldType.SHORT_TEXT:
    case FieldType.LONG_TEXT:
    case FieldType.RICH_TEXT:
        return String;

    case FieldType.UNSTRUCTURED:
        return Schema.Types.Mixed;

    case FieldType.NUMBER:
        return Number;

    case FieldType.RELATION_TO_MANY:
    case FieldType.RELATION_TO_ONE:
        return Schema.Types.ObjectId;
    default:
        throw new Error('unknown type '+type);
    }
}

/**
 * Converts a plain json schema definition into a mongoose schema definition.
 *
 * @param {Object} descriptor
 * @return {Object}
 */
let convert = function (descriptor) {
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
function getSchema(fields) {
    let fieldsObj = {};
    fields.forEach(f => {

        if (f.type_id === FieldType.RELATION_TO_MANY) {
            fieldsObj[f.name] = [{
                type: f.type_id,
                ref: f.related_content_type_slug
            }];

        } else if (f.type_id === FieldType.RELATION_TO_ONE) {

            fieldsObj[f.name] = {
                type: f.type_id,
                ref: f.related_content_type_slug
            };

        } else {
            fieldsObj[f.name] = {
                type: f.type_id,
                unique: f.unique,
                index: f.index ? f.index : f.unique
            };
        }
    });

    return convert(fieldsObj);
}

module.exports = {
    convert,
    getSchema
};