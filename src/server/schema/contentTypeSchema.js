import mongoose from 'mongoose';

let contentTypeSchema = mongoose.Schema({
    name: String,
    slug: String,
    description: String,
    fields: [{
	      related_content_type_id: String,
        type_id: Number,
        name: String,
        label: String
    }]
});

export default contentTypeSchema;