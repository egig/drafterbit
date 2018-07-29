import mongoose from 'mongoose';

let contentSchema = mongoose.Schema({
	content_value: [{
		type_id: Number,
		type_name: String,
		name: String,
		display_name: String
	}]
});

export default contentSchema;