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

module.exports = {
    convert
};