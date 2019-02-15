// project_id, name, `key`, restriction_type, restriction_value

const mongoose = require('mongoose');
const { Project } = require('../model');

const Schema = mongoose.Schema;

let apiKeySchema = mongoose.Schema({
	name: String,
	key: String,
	restriction_type: String,
	restriction_value: String,
	project: { type: Schema.Types.ObjectId, ref: 'Project' },
});

module.exports = apiKeySchema;