import mongoose from 'mongoose';

let userSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
});

export default  userSchema;