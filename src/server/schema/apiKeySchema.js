import mongoose from 'mongoose';

let apiKeySchema = mongoose.Schema({
    name: String,
    key: String,
    restriction_type: String,
    restriction_value: String
});

export default apiKeySchema;