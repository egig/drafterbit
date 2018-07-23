import mongoose from 'mongoose';

let projectSchema = mongoose.Schema({
	name: String,
	description: String
});

export default projectSchema