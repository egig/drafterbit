const mongoose = require('mongoose');
const userSchema = require('./userSchema');
const contentTypeSchema = require('./contentTypeSchema');
const Schema = mongoose.Schema;

let User = mongoose.model('User', userSchema);
let ContentType = mongoose.model('ContentType', contentTypeSchema);
let projectSchema = mongoose.Schema({
	name: String,
	description: String,
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	content_types: [{ type: Schema.Types.ObjectId, ref: 'ContentType' }]
});


module.exports =  projectSchema