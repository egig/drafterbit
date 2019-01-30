import mongoose from 'mongoose';
import userSchema from './schema/userSchema';
import projectSchema from './schema/projectSchema';
import contentTypeSchema from './schema/contentTypeSchema';
import contentSchema from './schema/contentSchema';


let User = mongoose.model('User', userSchema);
let Project = mongoose.model('Project', projectSchema);
let ContentType = mongoose.model('ContentType', contentTypeSchema);
let Content = mongoose.model('Content', contentSchema);

module.exports = {
	User,
	Project,
	ContentType,
	Content
}