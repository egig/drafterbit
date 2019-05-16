import mongoose from 'mongoose';
import contentTypeSchema from './contentTypeSchema';
const Schema = mongoose.Schema;

let contentSchema =  mongoose.Schema({
    content_type: { type: Schema.Types.ObjectId, ref: 'ContentType' },
    fields: [{
        label: String,
        type_id: Number,
        name: String,
        value: Schema.Types.Mixed
    }]
});

export default contentSchema;