import mongoose from 'mongoose';
import projectSchema from './projectSchema';

const Schema = mongoose.Schema;

let Project = mongoose.model('Project', projectSchema);
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

export default contentTypeSchema