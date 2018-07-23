import mongoose from 'mongoose';
import contentTypeSchema from './contentTypeSchema';

const Schema = mongoose.Schema;

let contentSchema = mongoose.Schema({
	content_value: [{
		type_id: Number,
		type_name: String,
		name: String,
		display_name: String
	}]
});

export default contentSchema;