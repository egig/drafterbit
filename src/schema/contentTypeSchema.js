import mongoose from 'mongoose';
const { Project } = require('../model');

const Schema = mongoose.Schema;

let contentTypeSchema = mongoose.Schema({
	name: String,
	slug: String,
	description: String,
	project: { type: Schema.Types.ObjectId, ref: 'Project' },
	fields: [{
		type_id: Number,
		type_name: String,
		name: String,
		display_name: String
	}]
});

module.exports = contentTypeSchema