const mongoose = require('mongoose');
const contentTypeSchema = require('./contentTypeSchema');
const Schema = mongoose.Schema;

let contentSchema = mongoose.Schema({
	content_type: { type: Schema.Types.ObjectId, ref: 'ContentType' },
	fields: [{
		label: String,
		type_id: Number,
		name: String,
		value: Schema.Types.Mixed
	}]
});

module.exports = contentSchema;