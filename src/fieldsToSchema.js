import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import {
	FIELD_SHORT_TEXT,
	FIELD_LONG_TEXT,
	FIELD_RICH_TEXT,
	FIELD_RELATION_TO_ONE,
	FIELD_RELATION_TO_MANY,
	FIELD_NUMBER,
} from './fieldTypes';

/**
 * Converts type names into actual types supported by mongoose.
 * @param {String} type - one of 'string', 'number', 'boolean',
 *                               'date', 'buffer', 'objectid', 'mixed'
 * @throws Error
 * @return {Object}
 */
function matchType(type) {

	switch (type) {
		case FIELD_SHORT_TEXT:
		case FIELD_LONG_TEXT:
		case FIELD_RICH_TEXT:
			return String;

		case FIELD_NUMBER:
			return Number;

		case FIELD_RELATION_TO_MANY:
			return [{ type: Schema.Types.ObjectId, ref: 'TODO_GET_MODEL_NAME' }];
		case FIELD_RELATION_TO_ONE:
			return { type: Schema.Types.ObjectId, ref: 'TODO_GET_MODEL_NAME' };
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
}