import mongoose from 'mongoose';
import userSchema from './userSchema';
const Schema = mongoose.Schema;

let User = mongoose.model('User', userSchema);
let projectSchema = mongoose.Schema({
	name: String,
	description: String,
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default projectSchema